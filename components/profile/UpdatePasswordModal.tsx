import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UpdatePasswordModalProps {
  onUpdate: (data: any) => Promise<void>;
}

export function UpdatePasswordModal({ onUpdate }: UpdatePasswordModalProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting, errors }, watch, reset } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: any) => {
    try {
      await onUpdate({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setOpen(false);
      reset();
      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) reset();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Update Password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input 
              id="currentPassword" 
              type="password"
              {...register("currentPassword", { 
                required: "Current password is required" 
              })} 
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input 
              id="newPassword" 
              type="password"
              {...register("newPassword", { 
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })} 
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input 
              id="confirmPassword" 
              type="password"
              {...register("confirmPassword", { 
                required: "Please confirm your password",
                validate: (value) => value === newPassword || "Passwords do not match"
              })} 
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
