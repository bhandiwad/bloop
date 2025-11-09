import { useEffect, useRef } from "react";
import { fireConfettiRain } from "@/lib/confetti";

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export function Confetti({ active, duration = 3000 }: ConfettiProps) {
  const activeRef = useRef(false);

  useEffect(() => {
    if (active && !activeRef.current) {
      activeRef.current = true;
      fireConfettiRain(duration);
      
      // Reset ref when confetti finishes
      const timer = setTimeout(() => {
        activeRef.current = false;
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    } else if (!active) {
      activeRef.current = false;
    }
  }, [active, duration]);

  return null;
}
