'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Loader2 } from 'lucide-react';
import { useCreateProductMutation, useGenerateProductUploadUrlMutation } from '@/features/admin/adminApi';
import { uploadToS3 } from '@/lib/uploadToS3';
import Image from 'next/image';

interface ProductFormProps {
  product?: any;
  onClose: () => void;
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || '',
    initialStock: product?.initialStock || '',
    description: product?.description || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [isUploading, setIsUploading] = useState(false);

  const [generateUploadUrl] = useGenerateProductUploadUrlMutation();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = product?.image || null;

      // Upload image if a new one is selected
      if (imageFile) {
        // Step 1: Get signed URL
        const { uploadUrl, finalUrl } = await generateUploadUrl({
          fileName: imageFile.name,
          contentType: imageFile.type,
        }).unwrap();

        // Step 2: Upload to S3
        await uploadToS3(imageFile, uploadUrl);

        // Step 3: Use final URL
        imageUrl = finalUrl;
      }

      // Step 4: Create product with image URL
      await createProduct({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        initialStock: parseInt(formData.initialStock) || 0,
        description: formData.description,
        image: imageUrl,
        isActive: true,
      }).unwrap();

      alert('Product created successfully!');
      onClose();
    } catch (error: any) {
      console.error('Failed to create product:', error);
      alert(error?.data?.message || 'Failed to create product');
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting = isLoading || isUploading;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <Label htmlFor="image">Product Image</Label>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Product preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                </div>
                <input
                  id="image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Classic T-Shirt"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Clothing"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              placeholder="29.99"
            />
          </div>
          <div>
            <Label htmlFor="stock">Initial Stock</Label>
            <Input
              id="stock"
              type="number"
              value={formData.initialStock}
              onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })}
              placeholder="100"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Product description..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isUploading ? 'Uploading...' : 'Creating...'}
              </>
            ) : (
              product ? 'Update Product' : 'Add Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
