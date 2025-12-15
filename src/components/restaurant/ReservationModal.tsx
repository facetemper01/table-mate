import { useState, useEffect } from "react";
import { TableWithStatus, Reservation } from "@/types/reservation";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Calendar, Clock, X, Pencil } from "lucide-react";
import { toast } from "sonner";

interface ReservationModalProps {
  table: TableWithStatus | null;
  isOpen: boolean;
  onClose: () => void;
  onReserve: (reservation: Omit<Reservation, "id" | "createdAt">) => void;
  onUpdate: (reservationId: string, updates: Partial<Omit<Reservation, "id" | "createdAt">>) => void;
  onCancel: (reservationId: string) => void;
  selectedDate: string;
  selectedTime: string;
}

export function ReservationModal({
  table,
  isOpen,
  onClose,
  onReserve,
  onUpdate,
  onCancel,
  selectedDate,
  selectedTime,
}: ReservationModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDropIn, setIsDropIn] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    partySize: table?.seats || 2,
    time: "19:00",
    notes: "",
  });

  // Reset form when table changes or modal opens
  useEffect(() => {
    if (table?.currentReservation && isEditing) {
      setFormData({
        guestName: table.currentReservation.guestName,
        guestPhone: table.currentReservation.guestPhone,
        partySize: table.currentReservation.partySize,
        time: table.currentReservation.time,
        notes: table.currentReservation.notes || "",
      });
      setIsDropIn(table.currentReservation.guestName === "Drop-in");
    } else if (!table?.isReserved) {
      setFormData({
        guestName: "",
        guestPhone: "",
        partySize: table?.seats || 2,
        time: selectedTime,
        notes: "",
      });
      setIsDropIn(false);
    }
  }, [table, isEditing]);

  // Reset editing state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setIsDropIn(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!table) return;

    const guestName = isDropIn ? "Drop-in" : formData.guestName;

    if (isEditing && table.currentReservation) {
      onUpdate(table.currentReservation.id, {
        guestName,
        guestPhone: formData.guestPhone,
        partySize: formData.partySize,
        time: formData.time,
        notes: formData.notes,
      });
      toast.success(`Reservation updated for Table ${table.number}`);
      setIsEditing(false);
    } else {
      onReserve({
        tableId: table.id,
        guestName,
        guestPhone: formData.guestPhone,
        partySize: formData.partySize,
        date: selectedDate,
        time: formData.time,
        notes: formData.notes,
      });
      toast.success(`Table ${table.number} reserved successfully!`);
    }

    onClose();
  };

  const handleCancelReservation = () => {
    if (!table?.currentReservation) return;
    onCancel(table.currentReservation.id);
    toast.success(`Reservation cancelled for Table ${table.number}`);
    onClose();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (!table) return null;

  const showForm = !table.isReserved || isEditing;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            Table {table.number}
            <span
              className={`text-sm px-2 py-0.5 rounded-full ${
                table.isReserved
                  ? "bg-destructive/20 text-destructive"
                  : "bg-success/20 text-success"
              }`}
            >
              {table.isReserved ? "Reserved" : "Available"}
            </span>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {table.seats} seats
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </DialogDescription>
        </DialogHeader>

        {table.isReserved && table.currentReservation && !isEditing ? (
          <div className="space-y-4">
            <div className="bg-secondary/50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-foreground">Current Reservation</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Guest:</span>
                  <p className="font-medium">{table.currentReservation.guestName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {table.currentReservation.time}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Party Size:</span>
                  <p className="font-medium">{table.currentReservation.partySize} guests</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium">{table.currentReservation.guestPhone}</p>
                </div>
              </div>
              {table.currentReservation.notes && (
                <div>
                  <span className="text-muted-foreground text-sm">Notes:</span>
                  <p className="text-sm italic">{table.currentReservation.notes}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleEditClick}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Reservation
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleCancelReservation}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex items-center gap-2">
                <Checkbox
                  id="dropIn"
                  checked={isDropIn}
                  onCheckedChange={(checked) => setIsDropIn(checked === true)}
                />
                <Label htmlFor="dropIn" className="cursor-pointer">Drop-in (walk-in guest)</Label>
              </div>
              {!isDropIn && (
                <div className="col-span-2">
                  <Label htmlFor="guestName">Guest Name</Label>
                  <Input
                    id="guestName"
                    value={formData.guestName}
                    onChange={(e) =>
                      setFormData({ ...formData, guestName: e.target.value })
                    }
                    placeholder="Enter guest name"
                    required
                    className="bg-secondary/50"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="guestPhone">Phone (Optional)</Label>
                <Input
                  id="guestPhone"
                  type="tel"
                  value={formData.guestPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, guestPhone: e.target.value })
                  }
                  placeholder="+47 XXX XX XXX"
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <Label htmlFor="partySize">Party Size</Label>
                <Input
                  id="partySize"
                  type="number"
                  min={1}
                  max={table.seats}
                  value={formData.partySize}
                  onChange={(e) =>
                    setFormData({ ...formData, partySize: parseInt(e.target.value) })
                  }
                  required
                  className="bg-secondary/50"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                  className="bg-secondary/50"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Special Requests (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any special requests or notes..."
                  className="bg-secondary/50 resize-none"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel Edit
                </Button>
              )}
              <Button type="submit" className={`${isEditing ? 'flex-1' : 'w-full'} bg-primary text-primary-foreground hover:bg-primary/90`}>
                {isEditing ? "Save Changes" : "Confirm Reservation"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
