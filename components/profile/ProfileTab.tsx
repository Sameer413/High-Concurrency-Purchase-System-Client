import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EditProfileModal } from "./EditProfileModal";
import { UpdatePasswordModal } from "./UpdatePasswordModal";

interface ProfileTabProps {
  user: any;
  displayUser: {
    name: string;
    email: string;
    phone: string;
  };
  onUpdateProfile: (data: any) => Promise<void>;
  onUpdatePassword: (data: any) => Promise<void>;
}

export function ProfileTab({ user, displayUser, onUpdateProfile, onUpdatePassword }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </div>
          <EditProfileModal user={user} onUpdate={onUpdateProfile} />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Full Name</label>
            <p className="font-medium">{displayUser.name}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Email Address</label>
            <p className="font-medium">{displayUser.email}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Phone Number</label>
            <p className="font-medium">{displayUser.phone}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Country</label>
            <p className="font-medium">United States</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle>Account Security</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground">Keep your account secure</p>
            </div>
            <UpdatePasswordModal onUpdate={onUpdatePassword} />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Multi-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Extra security for your account</p>
            </div>
            <Badge variant="secondary">Disabled</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
