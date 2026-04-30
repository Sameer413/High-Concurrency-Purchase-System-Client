import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Your order has been placed successfully. We&apos;ll send you a
            confirmation email with your order details and tracking information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
