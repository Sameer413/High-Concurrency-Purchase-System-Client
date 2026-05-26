"use client"

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, Truck, CheckCircle2, MapPin, Clock, Copy } from "lucide-react";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";

// Mock tracking data
const MOCK_TRACKING = {
  orderId: "ORD-7721",
  orderNumber: "ORD-7721",
  status: "Delivered",
  trackingNumber: "1Z999AA10123456784",
  carrier: "UPS",
  estimatedDelivery: "May 07, 2026",
  currentLocation: "New York, NY",
  timeline: [
    {
      status: "Order Placed",
      date: "May 04, 2026",
      time: "10:30 AM",
      location: "Online",
      completed: true,
      description: "Your order has been confirmed and is being prepared",
      icon: Package
    },
    {
      status: "Processing",
      date: "May 04, 2026",
      time: "2:15 PM",
      location: "Warehouse - Newark, NJ",
      completed: true,
      description: "Order is being picked and packed",
      icon: Package
    },
    {
      status: "Shipped",
      date: "May 05, 2026",
      time: "9:00 AM",
      location: "Newark, NJ Distribution Center",
      completed: true,
      description: "Package has been picked up by carrier",
      icon: Truck
    },
    {
      status: "In Transit",
      date: "May 06, 2026",
      time: "11:30 AM",
      location: "Philadelphia, PA Hub",
      completed: true,
      description: "Package is in transit to destination",
      icon: Truck
    },
    {
      status: "Out for Delivery",
      date: "May 07, 2026",
      time: "8:30 AM",
      location: "New York, NY Local Facility",
      completed: true,
      description: "Package is out for delivery today",
      icon: Truck
    },
    {
      status: "Delivered",
      date: "May 07, 2026",
      time: "3:45 PM",
      location: "New York, NY 10001",
      completed: true,
      description: "Package delivered successfully. Signed by: A. Pierce",
      icon: CheckCircle2
    }
  ]
};

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  // In real app, fetch tracking by order ID
  const tracking = MOCK_TRACKING;

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(tracking.trackingNumber);
    toast.success("Tracking number copied to clipboard");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "out for delivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in transit":
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.push(`/orders/${orderId}`)}
                className="mb-4 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Order Details
              </Button>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Track Your Order</h1>
                  <p className="text-slate-600 mt-1">Order #{tracking.orderNumber}</p>
                </div>
                <Badge className={`${getStatusColor(tracking.status)} border w-fit h-8 px-4`}>
                  {tracking.status}
                </Badge>
              </div>
            </div>

            {/* Tracking Info Card */}
            <Card className="border-none shadow-sm mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Tracking Number</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-slate-900">{tracking.trackingNumber}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={copyTrackingNumber}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Carrier</p>
                    <p className="font-semibold text-slate-900">{tracking.carrier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Current Location</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <p className="font-semibold text-slate-900">{tracking.currentLocation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {tracking.timeline.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex gap-4 pb-8 last:pb-0">
                        {/* Timeline Line */}
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`h-12 w-12 rounded-full flex items-center justify-center border-2 ${
                              item.completed
                                ? "bg-green-500 border-green-500 text-white"
                                : "bg-white border-slate-300 text-slate-400"
                            }`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          {index < tracking.timeline.length - 1 && (
                            <div
                              className={`w-0.5 flex-1 mt-2 ${
                                item.completed ? "bg-green-300" : "bg-slate-200"
                              }`}
                              style={{ minHeight: "60px" }}
                            />
                          )}
                        </div>

                        {/* Timeline Content */}
                        <div className="flex-1 pt-2">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-slate-900">{item.status}</h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{item.date} at {item.time}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 mb-1">{item.description}</p>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{item.location}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="border-none shadow-sm mt-6 bg-slate-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    If you have questions about your delivery, our support team is here to help.
                  </p>
                  <Button variant="outline">Contact Support</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
