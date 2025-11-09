import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

interface BloopedMessageProps {
  playerNames: string[];
  show: boolean;
  onDismiss: () => void;
  variant?: "fooled" | "got-fooled" | "correct"; // "fooled" = you fooled others, "got-fooled" = you got fooled, "correct" = you got it right
}

export function BloopedMessage({ playerNames, show, onDismiss, variant = "fooled" }: BloopedMessageProps) {
  if (!show && variant !== "correct") return null;
  if (variant === "correct" && !show) return null;

  const isFooled = variant === "fooled";
  const isCorrect = variant === "correct";
  const title = isCorrect ? "YOU GOT IT RIGHT!" : (isFooled ? "You BLOOP'D" : "YOU GOT BLOOP'D!");
  const subtitle = isFooled ? null : (isCorrect ? null : "BY");
  // Different colors for different variants
  const gradientColors = isCorrect
    ? "from-green-500 via-emerald-500 to-teal-500"
    : (isFooled 
      ? "from-chart-4 via-chart-3 to-chart-2" 
      : "from-destructive via-chart-5 to-chart-1");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 10 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onDismiss}
        >
          <Card className={`relative overflow-hidden bg-gradient-to-br ${gradientColors} border-4 border-white shadow-2xl cursor-pointer hover:scale-105 transition-transform`}>
            <div className="p-8 md:p-12 text-center space-y-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-4xl md:text-6xl font-black text-white drop-shadow-lg">
                  {title}
                </h2>
                <div className="h-1 w-32 mx-auto bg-white my-4" />
              </motion.div>

              {!isFooled && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="font-display text-2xl md:text-3xl font-black text-white drop-shadow-lg">
                    {subtitle}
                  </p>
                </motion.div>
              )}

              {!isCorrect && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  {playerNames.map((name, index) => (
                    <motion.p
                      key={name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="font-display text-3xl md:text-5xl font-bold text-white drop-shadow-lg uppercase"
                    >
                      {name}
                    </motion.p>
                  ))}
                </motion.div>
              )}

              {isCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-8xl"
                >
                  ✓
                </motion.div>
              )}

              {isFooled && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + playerNames.length * 0.1 }}
                >
                  <p className="text-sm text-white/80 mt-4">Click to dismiss</p>
                </motion.div>
              )}

              {!isFooled && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + playerNames.length * 0.1 }}
                >
                  <p className="text-sm text-white/80 mt-4">Click to dismiss</p>
                </motion.div>
              )}
            </div>

            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 20px)",
              }}
            />
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
