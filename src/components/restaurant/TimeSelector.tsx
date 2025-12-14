import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSelectorProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

// Generate time slots from 11:00 to 22:00 in 30-minute intervals
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 11; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 22) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export function TimeSelector({ selectedTime, onTimeChange }: TimeSelectorProps) {
  return (
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
  );
}
