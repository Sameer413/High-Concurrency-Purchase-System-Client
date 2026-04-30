import { Product } from "@/types/types";
import React from "react";

interface ColorSelectionProps {
  colors: string[] | null;
  selectedColor: string | null;
  setSelectedColor: (color: string) => void;
}

const ColorSelection: React.FC<ColorSelectionProps> = ({
  colors,
  selectedColor,
  setSelectedColor,
}) => {
  const availableColors = colors ?? [];

  if (availableColors.length === 0) {
    return null; // Don't render anything if there are no colors
  }

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3">Color</h3>
      <div className="flex flex-wrap gap-3">
        {colors?.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-10 h-10 rounded-full border-2 transition-all ${
              selectedColor === color
                ? "border-foreground scale-110"
                : "border-border hover:border-muted-foreground"
            }`}
            style={{
              backgroundColor:
                color === "Black"
                  ? "#000"
                  : color === "White"
                    ? "#fff"
                    : color === "Navy"
                      ? "#1a365d"
                      : color === "Gray"
                        ? "#6b7280"
                        : color === "Beige"
                          ? "#d4c5b9"
                          : color === "Olive"
                            ? "#556b2f"
                            : color === "Blue"
                              ? "#3b82f6"
                              : color === "Red"
                                ? "#dc2626"
                                : color === "Khaki"
                                  ? "#c3b091"
                                  : color === "Light Blue"
                                    ? "#93c5fd"
                                    : color === "Charcoal"
                                      ? "#374151"
                                      : "#ccc",
            }}
            title={color}
          />
        ))}
      </div>
      {selectedColor && (
        <p className="text-sm text-muted-foreground mt-2">{selectedColor}</p>
      )}
    </div>
  );
};

export default ColorSelection;
