import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Address as AddressType } from "@/features/address/addressApi";

interface AddressModalProps {
  address?: AddressType;
  onSave: (data: any) => Promise<void>;
}

export function AddressModal({ address, onSave }: AddressModalProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm({
    defaultValues: address ? {
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      landmark: address.landmark || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || "USA",
    } : {
      fullName: "",
      phone: "",
      line1: "",
      landmark: "",
      city: "",
      state: "",
      postalCode: "",
      country: "USA",
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await onSave(data);
      setOpen(false);
      if (!address) reset();
      toast.success(address ? "Address updated" : "Address added");
    } catch (error: any) {
      toast.error("Failed to save address");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {address ? (
          <Button variant="outline" size="sm" className="h-8">Edit</Button>
        ) : (
          <Card className="border-2 border-dashed border-slate-200 shadow-none flex flex-col items-center justify-center p-6 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer min-h-[200px]">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
              <Plus className="h-5 w-5 text-slate-500" />
            </div>
            <p className="text-sm font-medium">Add New Address</p>
          </Card>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone", { required: true })} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="line1">Address Line 1</Label>
            <Input id="line1" {...register("line1", { required: true })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="landmark">Landmark (Optional)</Label>
            <Input id="landmark" {...register("landmark")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state", { required: true })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" {...register("postalCode", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country", { required: true })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Save Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
