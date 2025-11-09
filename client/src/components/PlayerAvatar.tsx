import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAvatarById } from "@shared/avatars";

interface PlayerAvatarProps {
  name: string;
  avatar?: string;
  isHost?: boolean;
  score?: number;
  connected?: boolean;
  submitted?: boolean;
  size?: "sm" | "md" | "lg";
  showScore?: boolean;
}

export function PlayerAvatar({
  name,
  avatar,
  isHost = false,
  score = 0,
  connected = true,
  submitted = false,
  size = "md",
  showScore = false,
}: PlayerAvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-xl",
  };

  const iconSizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarOption = avatar ? getAvatarById(avatar) : null;
  const AvatarIcon = avatarOption?.icon;
  const avatarColor = avatarOption?.color || "bg-chart-1";

  return (
    <div className="relative flex flex-col items-center gap-1">
      <div className="relative">
        <Avatar
          className={cn(
            sizeClasses[size],
            avatarColor,
            !connected && "opacity-50 grayscale",
            submitted && "ring-4 ring-chart-3"
          )}
          data-testid={`avatar-${name.toLowerCase().replace(/\s/g, "-")}`}
        >
          <AvatarFallback className="bg-transparent text-primary-foreground font-display font-semibold flex items-center justify-center">
            {AvatarIcon ? (
              <AvatarIcon className={cn(iconSizeClasses[size], "stroke-[2.5]")} strokeWidth={2.5} />
            ) : (
              getInitials(name)
            )}
          </AvatarFallback>
        </Avatar>
        {isHost && (
          <div className="absolute -top-1 -right-1 bg-chart-4 rounded-full p-1">
            <Crown className="w-3 h-3 text-white" />
          </div>
        )}
        {submitted && (
          <div className="absolute -top-1 -left-1 bg-green-500 rounded-full p-1 shadow-lg">
            <Check className="w-3 h-3 text-white stroke-[3]" strokeWidth={3} />
          </div>
        )}
        {showScore && (
          <div
            className="absolute -bottom-1 -right-1 bg-card border-2 border-card-border rounded-full px-2 py-0.5 text-xs font-bold tabular-nums"
            data-testid={`score-${name.toLowerCase().replace(/\s/g, "-")}`}
          >
            {score}
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-center max-w-[80px] truncate">
        {name}
      </span>
    </div>
  );
}
