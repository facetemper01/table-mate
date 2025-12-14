import { useState } from "react";
import { Table } from "@/types/reservation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Save } from "lucide-react";
import { toast } from "sonner";

interface EditLayoutModalProps {
  tables: Table[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { id: string; seats: number }[]) => void;
}

export function EditLayoutModal({
  tables,
  isOpen,
  onClose,
  onSave,
}: EditLayoutModalProps) {
  const [seatUpdates, setSeatUpdates] = useState<Record<string, number>>({});

  const handleSeatChange = (tableId: string, seats: number) => {
    setSeatUpdates((prev) => ({
      ...prev,
      [tableId]: seats,
    }));
  };

  const handleSave = () => {
    const updates = Object.entries(seatUpdates).map(([id, seats]) => ({
      id,
      seats,
    }));
    
    if (updates.length > 0) {
      onSave(updates);
      toast.success(`Updated ${updates.length} table(s)`);
    }
    
    setSeatUpdates({});
    onClose();
  };

  const handleClose = () => {
    setSeatUpdates({});
    onClose();
  };

  const getSeats = (table: Table) => {
    return seatUpdates[table.id] ?? table.seats;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Edit Table Layout
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Adjust the number of seats for each table
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-3">
            {tables.map((table) => (
              <div
                key={table.id}
                className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded-lg text-sm font-semibold min-w-[70px] text-center">
                    Table {table.number}
                  </span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {table.shape}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`seats-${table.id}`} className="text-sm text-muted-foreground">
                    Seats:
                  </Label>
                  <Input
                    id={`seats-${table.id}`}
                    type="number"
                    min={1}
                    max={20}
                    value={getSeats(table)}
                    onChange={(e) =>
                      handleSeatChange(table.id, parseInt(e.target.value) || 1)
                    }
                    className="w-16 bg-background text-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
