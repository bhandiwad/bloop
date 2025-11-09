import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface TimerProps {
  endTime: number;
  totalDuration: number;
  onComplete?: () => void;
}

export function Timer({ endTime, totalDuration, onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        if (!completedRef.current && onComplete) {
          completedRef.current = true;
          onComplete();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [endTime, onComplete]);

  const percentage = timeLeft > 0 ? (timeLeft / totalDuration) * 100 : 0;
  const isUrgent = timeLeft <= 5;
  const isWarning = timeLeft <= 10 && timeLeft > 5;

  const circleColor = isUrgent
    ? "hsl(var(--destructive))"
    : isWarning
    ? "hsl(var(--chart-4))"
    : "hsl(var(--chart-2))";

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={circleColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45}`}
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
          animate={{
            strokeDashoffset: `${2 * Math.PI * 45 * (1 - percentage / 100)}`,
          }}
          transition={{ duration: 0.1 }}
        />
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center font-display text-3xl font-bold tabular-nums"
        animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
      >
        {timeLeft}
      </motion.div>
    </div>
  );
}
