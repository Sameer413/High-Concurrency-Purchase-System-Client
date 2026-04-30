import { Header } from "@/components/common/header";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CollectionsSection } from "@/components/home/collection-section";
import { BestSellers } from "@/components/home/best-seller";
import { Footer } from "@/components/common/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <CollectionsSection />
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
}
