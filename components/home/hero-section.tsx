import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="py-16 md:py-24">
            <span className="text-sm font-medium tracking-wider text-muted-foreground mb-4 block">
              SUMMER 2024
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              New
              <br />
              Collection
            </h1>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              Discover our latest arrivals. Premium quality clothing designed
              for the modern individual who values both style and comfort.
            </p>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8">
                Go To Shop
              </Button>
            </Link>
          </div>

          {/* Right Content - Featured Image */}
          <div className="relative h-[400px] md:h-[600px] bg-muted rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl md:text-9xl font-bold text-muted-foreground/20">
                  XIV
                </div>
                <div className="text-2xl md:text-3xl font-medium text-muted-foreground/40 mt-4">
                  23-24
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-background rounded-xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-secondary rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-medium">Cotton T-Shirt</h3>
                  <p className="text-sm text-muted-foreground">$ 199</p>
                </div>
                <Link href="/products">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
