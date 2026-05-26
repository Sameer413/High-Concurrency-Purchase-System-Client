'use client';

import { useState } from 'react';
import { ProductList } from '@/components/admin/products/ProductList';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {showForm ? (
        <ProductForm 
          product={editingProduct} 
          onClose={handleClose}
        />
      ) : (
        <ProductList onEdit={handleEdit} />
      )}
    </div>
  );
}
