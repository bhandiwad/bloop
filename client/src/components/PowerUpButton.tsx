import { motion } from "framer-motion";
import { Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PowerUpType } from "@shared/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PowerUpButtonProps {
  powerUp: PowerUpType;
  used: boolean;
  onUse: () => void;
  disabled?: boolean;
}

export function PowerUpButton({ powerUp, used, onUse, disabled }: PowerUpButtonProps) {
  if (!powerUp || used || powerUp === null) return null;

  const config: Record<"swap" | "spy", { icon: any; label: string; description: string; color: string }> = {
    swap: {
      icon: Sparkles,
      label: "Swap",
      description: "Replace your answer with an AI-generated one",
      color: "from-purple-500 to-pink-500",
    },
    spy: {
      icon: Eye,
      label: "Spy",
      description: "See how many people voted for your answer (live)",
      color: "from-blue-500 to-cyan-500",
    },
  };

  const { icon: Icon, label, description, color } = config[powerUp as "swap" | "spy"];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <Button
              onClick={onUse}
              disabled={disabled}
              className={`relative overflow-hidden bg-gradient-to-r ${color} hover:opacity-90 text-white font-bold shadow-lg`}
              size="lg"
            >
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
                style={{ opacity: 0.2 }}
              />
              <Icon className="w-5 h-5 mr-2" />
              {label} Power-Up
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface SpyDisplayProps {
  voteCount: number;
}

export function SpyDisplay({ voteCount }: SpyDisplayProps) {
  return (
    <motion.div
      initial={{ scale: 0, y: -20 }}
      animate={{ scale: 1, y: 0 }}
      className="fixed top-24 right-4 z-50"
    >
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-white/20">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6" />
          <div>
            <p className="text-sm font-medium opacity-90">Spy Active</p>
            <p className="text-2xl font-bold">{voteCount} votes</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
