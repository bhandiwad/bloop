import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { soundManager } from "@/lib/sounds";

export function SoundToggle() {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isSoundEnabled());

  const toggleSound = () => {
    const newState = soundManager.toggleSounds();
    setSoundEnabled(newState);
    if (newState) {
      soundManager.play('tick');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSound}
      data-testid="button-toggle-sound"
      title={soundEnabled ? "Mute sounds" : "Enable sounds"}
    >
      {soundEnabled ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </Button>
  );
}
