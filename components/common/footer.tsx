import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">ELEGANT VOGUE</h3>
            <p className="text-background/70 max-w-md leading-relaxed">
              Our approach to fashion design blends creativity with
              craftsmanship to create fashion that transcends trends and stands
              the test of time. Each design is meticulously crafted, ensuring
              the highest quality and exquisite finish.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Info</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Technologies</h4>
            <ul className="space-y-2">
              <li className="text-background/70">NFC</li>
              <li className="text-background/70">QR</li>
              <li className="text-background/70">VR</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-background/70">
            <span>© 2024 — copyright</span>
            <Link
              href="/privacy"
              className="hover:text-background transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-background transition-colors"
            >
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-background/70">
            <span>Languages:</span>
            <button className="hover:text-background transition-colors">
              Eng
            </button>
            <span>/</span>
            <button className="hover:text-background transition-colors">
              Esp
            </button>
            <span>/</span>
            <button className="hover:text-background transition-colors">
              Sve
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
