import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnswerCardProps {
  text: string;
  playerName?: string;
  isCorrect?: boolean;
  isAI?: boolean;
  votes?: number;
  selected?: boolean;
  revealed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function AnswerCard({
  text,
  playerName,
  isCorrect = false,
  isAI = false,
  votes = 0,
  selected = false,
  revealed = false,
  onClick,
  disabled = false,
}: AnswerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <Card
        onClick={!disabled ? onClick : undefined}
        className={cn(
          "min-h-24 p-4 cursor-pointer hover-elevate active-elevate-2 transition-all",
          selected && "ring-4 ring-primary",
          disabled && "cursor-default opacity-60",
          revealed && isCorrect && "ring-4 ring-chart-3 bg-chart-3/10"
        )}
        data-testid={`card-answer-${text.slice(0, 20).replace(/\s/g, "-")}`}
      >
        <div className="flex flex-col gap-3">
          <p className="text-base font-medium leading-relaxed">{text}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {revealed && playerName && (
                <Badge variant="secondary" className="text-xs">
                  {isAI ? "AI" : playerName}
                </Badge>
              )}
              {revealed && isCorrect && (
                <Badge className="bg-chart-3 text-white gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Correct!
                </Badge>
              )}
            </div>

            {revealed && votes > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="font-medium tabular-nums">{votes}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
