import React from "react";

interface SizeSelectionProps {
  sizes: string[] | null;
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
}

const SizeSelection: React.FC<SizeSelectionProps> = ({
  selectedSize,
  setSelectedSize,
  sizes,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Size</h3>
        <button className="text-sm text-muted-foreground hover:text-foreground underline">
          Find your size | Measurement guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes?.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              selectedSize === size
                ? "bg-foreground text-background border-foreground"
                : "border-border hover:border-foreground"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelection;
