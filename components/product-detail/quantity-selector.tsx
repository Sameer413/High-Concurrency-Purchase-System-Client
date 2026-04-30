import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  quantity: number;
  setQuantity: (quantity: number) => void;
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  setQuantity,
}) => {
  return (
    <div className="mb-8">
      <h3 className="font-medium mb-3">Quantity</h3>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-lg font-medium w-8 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
