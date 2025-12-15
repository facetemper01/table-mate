import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TimeSelectorProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

// Generate time slots from 11:00 to 22:00 in 15-minute intervals
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 11; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 22) {
      slots.push(`${hour.toString().padStart(2, "0")}:15`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
      slots.push(`${hour.toString().padStart(2, "0")}:45`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const getCurrentTimeRounded = (): string => {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  const hours = now.getHours() + (roundedMinutes === 60 ? 1 : 0);
  const finalMinutes = roundedMinutes === 60 ? 0 : roundedMinutes;
  
  // Clamp to operating hours (11:00 - 22:00)
  const clampedHours = Math.max(11, Math.min(22, hours));
  const clampedMinutes = clampedHours === 22 ? 0 : finalMinutes;
  
  return `${clampedHours.toString().padStart(2, "0")}:${clampedMinutes.toString().padStart(2, "0")}`;
};

export function TimeSelector({ selectedTime, onTimeChange }: TimeSelectorProps) {
  const handleNowClick = () => {
    onTimeChange(getCurrentTimeRounded());
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-secondary/50 rounded-xl p-2 border border-border">
        <Clock className="w-4 h-4 text-primary ml-2" />
        <Select value={selectedTime} onValueChange={onTimeChange}>
          <SelectTrigger className="w-[120px] border-0 bg-transparent focus:ring-0 font-display font-medium text-lg">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNowClick}
        className="w-full"
      >
        Now
      </Button>
    </div>
  );
}
