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
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Save, Link2, Unlink } from "lucide-react";
import { toast } from "sonner";

interface EditLayoutModalProps {
  tables: Table[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { id: string; seats: number }[]) => void;
  onCombineTables: (tableIds: string[]) => void;
  onUncombineTable: (tableId: string) => void;
}

export function EditLayoutModal({
  tables,
  isOpen,
  onClose,
  onSave,
  onCombineTables,
  onUncombineTable,
}: EditLayoutModalProps) {
  const [seatUpdates, setSeatUpdates] = useState<Record<string, number>>({});
  const [selectedForCombine, setSelectedForCombine] = useState<string[]>([]);

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
    setSelectedForCombine([]);
    onClose();
  };

  const getSeats = (table: Table) => {
    return seatUpdates[table.id] ?? table.seats;
  };

  const toggleTableSelection = (tableId: string) => {
    setSelectedForCombine((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleCombine = () => {
    if (selectedForCombine.length < 2) {
      toast.error("Select at least 2 tables to combine");
      return;
    }
    onCombineTables(selectedForCombine);
    setSelectedForCombine([]);
    toast.success("Tables combined successfully");
  };

  const handleUncombine = (tableId: string) => {
    onUncombineTable(tableId);
    toast.success("Table uncombined");
  };

  const isTableCombined = (table: Table) => {
    return table.combinedWith && table.combinedWith.length > 0;
  };

  const canSelectForCombine = (table: Table) => {
    return !isTableCombined(table);
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
            Adjust seats and combine tables for larger groups
          </DialogDescription>
        </DialogHeader>

        {/* Combine Tables Section */}
        <div className="bg-secondary/30 p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Combine Tables</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCombine}
              disabled={selectedForCombine.length < 2}
              className="gap-1"
            >
              <Link2 className="w-3 h-3" />
              Combine ({selectedForCombine.length})
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Select multiple tables below to combine them
          </p>
        </div>

        <ScrollArea className="max-h-[350px] pr-4">
          <div className="space-y-3">
            {tables.map((table) => (
              <div
                key={table.id}
                className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {canSelectForCombine(table) && (
                    <Checkbox
                      checked={selectedForCombine.includes(table.id)}
                      onCheckedChange={() => toggleTableSelection(table.id)}
                    />
                  )}
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded-lg text-sm font-semibold min-w-[70px] text-center">
                    {table.displayName ? `Table ${table.displayName}` : `Table ${table.number}`}
                  </span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {table.shape}
                  </span>
                  {isTableCombined(table) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUncombine(table.id)}
                      className="h-6 px-2 text-xs gap-1 text-destructive hover:text-destructive"
                    >
                      <Unlink className="w-3 h-3" />
                      Split
                    </Button>
                  )}
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
