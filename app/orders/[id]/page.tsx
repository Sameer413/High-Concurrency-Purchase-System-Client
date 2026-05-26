"use client"

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, Truck, CheckCircle2, MapPin, CreditCard, Download, Phone, Mail } from "lucide-react";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/components/ProtectedRoute";

// Mock order data - will be replaced with real API
const MOCK_ORDER = {
  id: "ORD-7721",
  orderNumber: "ORD-7721",
  date: "May 04, 2026",
  status: "Delivered",
  total: 249.00,
  subtotal: 229.00,
  shipping: 15.00,
  tax: 5.00,
  paymentMethod: "Visa ending in 4242",
  items: [
    {
      id: "1",
      name: "Premium Leather Jacket",
      color: "Black",
      size: "L",
      quantity: 1,
      price: 229.00,
      image: "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=400&h=400&fit=crop"
    }
  ],
  shippingAddress: {
    name: "Alexander Pierce",
    line1: "123 Main Street",
    line2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567"
  },
  timeline: [
    {
      status: "Order Placed",
      date: "May 04, 2026",
      time: "10:30 AM",
      completed: true,
      description: "Your order has been confirmed"
    },
    {
      status: "Processing",
      date: "May 04, 2026",
      time: "2:15 PM",
      completed: true,
      description: "Order is being prepared"
    },
    {
      status: "Shipped",
      date: "May 05, 2026",
      time: "9:00 AM",
      completed: true,
      description: "Package handed to carrier",
      trackingNumber: "1Z999AA10123456784"
    },
    {
      status: "Out for Delivery",
      date: "May 07, 2026",
      time: "8:30 AM",
      completed: true,
      description: "Package is out for delivery"
    },
    {
      status: "Delivered",
      date: "May 07, 2026",
      time: "3:45 PM",
      completed: true,
      description: "Package delivered successfully"
    }
  ]
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  // In real app, fetch order by ID
  const order = MOCK_ORDER;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
      case "out for delivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Order Details</h1>
                  <p className="text-slate-600 mt-1">
                    Order #{order.orderNumber} • Placed on {order.date}
                  </p>
                </div>
                <Badge className={`${getStatusColor(order.status)} border w-fit h-8 px-4`}>
                  {order.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Status Timeline - Horizontal Minimal */}
                <Card className="border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between relative">
                      {/* Progress Line */}
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200">
                        <div 
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: "100%" }}
                        />
                      </div>

                      {/* Timeline Steps */}
                      {["Order Placed", "Processing", "Shipped", "Delivered"].map((step, index) => {
                        const isCompleted = index <= 3; // All completed for delivered order
                        return (
                          <div key={step} className="flex flex-col items-center relative z-10 flex-1">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                                isCompleted
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "bg-white border-slate-300 text-slate-400"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-slate-300" />
                              )}
                            </div>
                            <p className={`text-xs mt-2 text-center ${isCompleted ? "text-slate-900 font-medium" : "text-slate-500"}`}>
                              {step}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 text-center">
                      <Button
                        variant="link"
                        onClick={() => router.push(`/orders/${orderId}/track`)}
                        className="text-sm"
                      >
                        View Detailed Tracking
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-24 w-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{item.name}</h3>
                          <div className="flex gap-4 mt-1 text-sm text-slate-600">
                            <span>Color: {item.color}</span>
                            <span>Size: {item.size}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <p className="font-semibold text-slate-900 mt-2">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Order Summary */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-medium">${order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax</span>
                      <span className="font-medium">${order.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900">Total</span>
                      <span className="font-bold text-lg text-slate-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p className="font-semibold text-slate-900">{order.shippingAddress.name}</p>
                    <p className="text-slate-600">{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && (
                      <p className="text-slate-600">{order.shippingAddress.line2}</p>
                    )}
                    <p className="text-slate-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-slate-600">{order.shippingAddress.country}</p>
                    <div className="pt-2 flex items-center gap-1 text-slate-600">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{order.shippingAddress.phone}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{order.paymentMethod}</p>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="h-4 w-4" />
                    Download Invoice
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
