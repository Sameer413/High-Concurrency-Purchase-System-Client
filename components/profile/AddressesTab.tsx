import { Home, Briefcase, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Address as AddressType } from "@/features/address/addressApi";
import { AddressModal } from "./AddressModal";

interface AddressesTabProps {
  addresses: AddressType[];
  isLoading: boolean;
  onUpdateAddress: (id: string, data: any) => Promise<void>;
  onDeleteAddress: (id: string) => void;
  onSetDefault: (id: string) => void;
  onCreateAddress: (data: any) => Promise<void>;
}

export function AddressesTab({
  addresses,
  isLoading,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefault,
  onCreateAddress,
}: AddressesTabProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="h-[200px] animate-pulse bg-slate-100 border-none" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addresses.map((addr) => (
        <Card 
          key={addr.id} 
          className={cn(
            "border-2 shadow-sm transition-all", 
            addr.isDefault ? "border-slate-900" : "border-transparent"
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {addr.line1.toLowerCase().includes('office') ? (
                  <Briefcase className="h-4 w-4" />
                ) : (
                  <Home className="h-4 w-4" />
                )}
                <CardTitle className="text-base font-bold">{addr.fullName}</CardTitle>
              </div>
              {addr.isDefault && <Badge className="text-[9px] h-4">DEFAULT</Badge>}
            </div>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-1">
            <p>{addr.line1}</p>
            {addr.landmark && <p className="text-xs italic text-slate-400">{addr.landmark}</p>}
            <p>{addr.city}, {addr.state} {addr.postalCode}</p>
            <p>{addr.phone}</p>
          </CardContent>
          <CardFooter className="gap-2 pt-2 border-t mt-2">
            <AddressModal 
              address={addr} 
              onSave={async (data) => { await onUpdateAddress(addr.id, data); }} 
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50" 
              onClick={() => onDeleteAddress(addr.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            {!addr.isDefault && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs ml-auto" 
                onClick={() => onSetDefault(addr.id)}
              >
                Set Default
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
      <AddressModal onSave={onCreateAddress} />
    </div>
  );
}
