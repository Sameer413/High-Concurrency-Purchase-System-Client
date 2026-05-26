import { Clock, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  date: string;
  status: string;
  total: string;
  items: Array<{
    name: string;
    quantity: number;
    image: string;
  }>;
}

interface OrdersTabProps {
  orders: Order[];
}

export function OrdersTab({ orders }: OrdersTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card 
          key={order.id} 
          className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group"
          onClick={() => router.push(`/orders/${order.id}`)}
        >
          <div className="flex items-stretch">
            <div className="p-4 bg-slate-50 border-r border-slate-100 flex items-center">
              <div className="h-20 w-20 rounded-xl overflow-hidden shadow-sm">
                <img 
                  src={order.items[0].image} 
                  alt="" 
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
            </div>
            <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-slate-900 tracking-tight">{order.id}</span>
                  <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Ordered on {order.date}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
                  <p className="font-black text-slate-900">{order.total}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
