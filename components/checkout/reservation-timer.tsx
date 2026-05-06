"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface ReservationTimerProps {
  timeRemaining: number | null; // milliseconds
  onExpire?: () => void;
}

export function ReservationTimer({
  timeRemaining,
  onExpire,
}: ReservationTimerProps) {
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    if (timeRemaining === 0 && !hasExpired) {
      setHasExpired(true);
      onExpire?.();
    }
  }, [timeRemaining, hasExpired, onExpire]);

  if (timeRemaining === null) return null;

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  const isUrgent = timeRemaining < 120000; // Less than 2 minutes
  const isExpired = timeRemaining === 0;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
        isExpired
          ? "bg-red-50 border-red-200 text-red-700"
          : isUrgent
            ? "bg-orange-50 border-orange-200 text-orange-700"
            : "bg-blue-50 border-blue-200 text-blue-700"
      }`}
    >
      <Clock className="w-5 h-5" />
      <div className="flex-1">
        <p className="text-sm font-medium">
          {isExpired ? "Reservation Expired" : "Reservation Time Remaining"}
        </p>
        {!isExpired && (
          <p className="text-lg font-bold">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        )}
      </div>
      {isUrgent && !isExpired && (
        <p className="text-xs">Complete checkout soon!</p>
      )}
    </div>
  );
}
