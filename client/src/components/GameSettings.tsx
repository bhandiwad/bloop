import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import type { GameRoom, GameSettings as GameSettingsType } from "@shared/schema";

interface GameSettingsProps {
  room: GameRoom;
  isHost: boolean;
  onUpdateSettings: (settings: Partial<GameSettingsType>) => void;
}

export function GameSettings({ room, isHost, onUpdateSettings }: GameSettingsProps) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<GameSettingsType>({
    totalRounds: room.totalRounds,
    collectTime: room.settings.collectTime,
    voteTime: room.settings.voteTime,
    revealTime: room.settings.revealTime,
    pointsCorrect: room.settings.pointsCorrect,
    pointsPerFool: room.settings.pointsPerFool,
    pointsFoolAll: room.settings.pointsFoolAll,
    pointsTimeout: room.settings.pointsTimeout,
  });

  if (!isHost) return null;

  const handleSave = () => {
    onUpdateSettings(settings);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-settings">
          <Settings className="w-4 h-4 mr-2" />
          Game Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Game Configuration</h3>
            
            <div className="space-y-2">
              <Label htmlFor="totalRounds">Total Rounds</Label>
              <Input
                id="totalRounds"
                type="number"
                min={1}
                max={10}
                value={settings.totalRounds}
                onChange={(e) => setSettings({ ...settings, totalRounds: parseInt(e.target.value) || 3 })}
                data-testid="input-total-rounds"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collectTime">Answer Time (seconds)</Label>
              <Input
                id="collectTime"
                type="number"
                min={30}
                max={300}
                value={settings.collectTime}
                onChange={(e) => setSettings({ ...settings, collectTime: parseInt(e.target.value) || 180 })}
                data-testid="input-collect-time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voteTime">Vote Time (seconds)</Label>
              <Input
                id="voteTime"
                type="number"
                min={15}
                max={120}
                value={settings.voteTime}
                onChange={(e) => setSettings({ ...settings, voteTime: parseInt(e.target.value) || 60 })}
                data-testid="input-vote-time"
              />
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Point Values</h3>
            
            <div className="space-y-2">
              <Label htmlFor="pointsCorrect">Correct Answer</Label>
              <Input
                id="pointsCorrect"
                type="number"
                min={0}
                max={10}
                value={settings.pointsCorrect}
                onChange={(e) => setSettings({ ...settings, pointsCorrect: parseInt(e.target.value) || 2 })}
                data-testid="input-points-correct"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointsPerFool">Points Per Player Fooled</Label>
              <Input
                id="pointsPerFool"
                type="number"
                min={0}
                max={5}
                value={settings.pointsPerFool}
                onChange={(e) => setSettings({ ...settings, pointsPerFool: parseInt(e.target.value) || 1 })}
                data-testid="input-points-per-fool"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointsFoolAll">Fool Everyone Bonus</Label>
              <Input
                id="pointsFoolAll"
                type="number"
                min={0}
                max={10}
                value={settings.pointsFoolAll}
                onChange={(e) => setSettings({ ...settings, pointsFoolAll: parseInt(e.target.value) || 2 })}
                data-testid="input-points-fool-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointsTimeout">Timeout Penalty</Label>
              <Input
                id="pointsTimeout"
                type="number"
                min={-5}
                max={0}
                value={settings.pointsTimeout}
                onChange={(e) => setSettings({ ...settings, pointsTimeout: parseInt(e.target.value) || -1 })}
                data-testid="input-points-timeout"
              />
            </div>
          </Card>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1" data-testid="button-save-settings">
              Save Settings
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
