import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyCart() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>

        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
