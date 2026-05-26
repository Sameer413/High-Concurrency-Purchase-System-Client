import { User, Package, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProfileSidebarProps {
  displayUser: {
    name: string;
    email: string;
    avatar: string;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export function ProfileSidebar({ displayUser, activeTab, onTabChange, onLogout }: ProfileSidebarProps) {
  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
  ];

  return (
    <aside className="w-full md:w-80 space-y-6">
      <Card className="border-none shadow-md overflow-hidden bg-white">
        <div className="h-24 bg-gradient-to-r from-slate-900 to-slate-800" />
        <CardContent className="pt-0 relative">
          <div className="flex flex-col items-center -mt-12">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
              <AvatarFallback>{displayUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center px-4">
              <h2 className="text-xl font-bold text-slate-900 truncate w-full">{displayUser.name}</h2>
              <p className="text-sm text-muted-foreground truncate w-full">{displayUser.email}</p>
            </div>
          </div>
          <Separator className="my-6" />
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full justify-start gap-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                  activeTab === item.id && "bg-slate-100 text-slate-900 font-medium"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
          <Separator className="my-6" />
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
