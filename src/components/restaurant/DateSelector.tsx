import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, subDays } from "date-fns";
interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}
export function DateSelector({
  selectedDate,
  onDateChange
}: DateSelectorProps) {
  const currentDate = new Date(selectedDate);
  const goToPrevDay = () => {
    onDateChange(format(subDays(currentDate, 1), "yyyy-MM-dd"));
  };
  const goToNextDay = () => {
    onDateChange(format(addDays(currentDate, 1), "yyyy-MM-dd"));
  };
  const goToToday = () => {
    onDateChange(format(new Date(), "yyyy-MM-dd"));
  };
  const isToday = format(new Date(), "yyyy-MM-dd") === selectedDate;
  return <div className="flex items-center gap-2 bg-secondary/50 rounded-xl p-2 border border-border">
      <Button variant="ghost" size="icon" onClick={goToPrevDay} className="hover:bg-secondary">
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-2 px-3 min-w-[200px] justify-center">
        <Calendar className="w-4 h-4 text-primary" />
        <span className="font-medium text-lg font-sans">
          {format(currentDate, "EEEE, MMM d")}
        </span>
      </div>

      <Button variant="ghost" size="icon" onClick={goToNextDay} className="hover:bg-secondary">
        <ChevronRight className="w-4 h-4" />
      </Button>

      {!isToday && <Button variant="outline" size="sm" onClick={goToToday} className="ml-2 text-xs">
          Today
        </Button>}
    </div>;
}