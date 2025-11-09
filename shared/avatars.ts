import { 
  Zap,
  Sword,
  Flame,
  Skull,
  Swords,
  Target,
  Glasses,
  Brain,
  Hammer,
  Wand2,
  Ghost,
  Network,
  Rocket,
  Crown,
  Sparkle,
  Axe,
  Shield,
  Moon,
  Star,
  Snowflake,
  Waves,
  Heart,
  CircleDot,
  Hexagon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AvatarOption {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  // Original heroes
  { id: "flash", name: "The Flash", icon: Zap, color: "bg-chart-1" },
  { id: "captain", name: "Captain America", icon: Sword, color: "bg-chart-2" },
  { id: "torch", name: "Human Torch", icon: Flame, color: "bg-chart-3" },
  { id: "punisher", name: "The Punisher", icon: Skull, color: "bg-chart-4" },
  { id: "deadpool", name: "Deadpool", icon: Swords, color: "bg-chart-5" },
  { id: "hawkeye", name: "Hawkeye", icon: Target, color: "bg-chart-1" },
  { id: "superman", name: "Superman", icon: Glasses, color: "bg-chart-2" },
  { id: "professor", name: "Professor X", icon: Brain, color: "bg-chart-3" },
  { id: "thor", name: "Thor", icon: Hammer, color: "bg-chart-4" },
  { id: "wizard", name: "Doctor Strange", icon: Wand2, color: "bg-chart-5" },
  { id: "phantom", name: "The Phantom", icon: Ghost, color: "bg-chart-1" },
  { id: "spidey", name: "Spider-Man", icon: Network, color: "bg-chart-2" },
  { id: "ironman", name: "Iron Man", icon: Rocket, color: "bg-chart-3" },
  { id: "blackpanther", name: "Black Panther", icon: Crown, color: "bg-chart-4" },
  { id: "wonderwoman", name: "Wonder Woman", icon: Sparkle, color: "bg-chart-5" },
  { id: "kratos", name: "Kratos", icon: Axe, color: "bg-chart-1" },
  
  // New dark/high-contrast avatars
  { id: "batman", name: "Batman", icon: Moon, color: "bg-slate-900" },
  { id: "venom", name: "Venom", icon: Skull, color: "bg-zinc-900" },
  { id: "nightwing", name: "Nightwing", icon: Star, color: "bg-indigo-900" },
  { id: "iceman", name: "Iceman", icon: Snowflake, color: "bg-cyan-700" },
  { id: "aquaman", name: "Aquaman", icon: Waves, color: "bg-blue-800" },
  { id: "scarlet", name: "Scarlet Witch", icon: Heart, color: "bg-rose-700" },
  { id: "cyclops", name: "Cyclops", icon: CircleDot, color: "bg-red-700" },
  { id: "sentinel", name: "Sentinel", icon: Hexagon, color: "bg-purple-900" },
  { id: "shield-agent", name: "Shield Agent", icon: Shield, color: "bg-gray-800" },
];

export function getAvatarById(id: string): AvatarOption | undefined {
  return AVATAR_OPTIONS.find((avatar) => avatar.id === id);
}

export function getRandomAvatar(): AvatarOption {
  return AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
}
