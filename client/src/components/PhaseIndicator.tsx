import { motion } from "framer-motion";
import { Edit3, Vote, Eye, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "collect" | "vote" | "reveal" | "leaderboard";

interface PhaseIndicatorProps {
  currentPhase: Phase;
}

export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  const phases = [
    { key: "collect", label: "Collect", icon: Edit3 },
    { key: "vote", label: "Vote", icon: Vote },
    { key: "reveal", label: "Reveal", icon: Eye },
    { key: "leaderboard", label: "Results", icon: Trophy },
  ];

  const currentIndex = phases.findIndex((p) => p.key === currentPhase);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 py-4">
      {phases.map((phase, index) => {
        const Icon = phase.icon;
        const isActive = phase.key === currentPhase;
        const isPast = index < currentIndex;

        return (
          <div key={phase.key} className="flex items-center gap-2 md:gap-4">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                  isActive &&
                    "bg-primary border-primary text-primary-foreground",
                  isPast && "bg-chart-3 border-chart-3 text-white",
                  !isActive && !isPast && "border-border text-muted-foreground"
                )}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive && "text-foreground",
                  !isActive && "text-muted-foreground"
                )}
              >
                {phase.label}
              </span>
            </div>
            {index < phases.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mb-6 transition-colors",
                  isPast ? "bg-chart-3" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
