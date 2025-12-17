import { Reservation } from "@/types/reservation";
import { restaurantTables } from "@/data/tables";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, Phone, MessageSquare, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReservationListProps {
  reservations: Reservation[];
  onCancel: (reservationId: string) => void;
  showDate?: boolean;
}

export function ReservationList({ reservations, onCancel, showDate = false }: ReservationListProps) {
  const { t } = useLanguage();
  
  const getTableNumber = (tableId: string) => {
    return restaurantTables.find((t) => t.id === tableId)?.number || 0;
  };

  const handleCancel = (reservation: Reservation) => {
    onCancel(reservation.id);
  };

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="font-body">{showDate ? t("noReservationsAll") : t("noReservations")}</p>
      </div>
    );
  }

  const sortedReservations = [...reservations].sort((a, b) => {
    if (showDate) {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
    }
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {sortedReservations.map((reservation, index) => (
          <motion.div
            key={reservation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-secondary/50 border border-border rounded-xl p-4 hover:bg-secondary/70 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded-lg text-sm font-semibold">
                    {t("table")} {getTableNumber(reservation.tableId)}
                  </span>
                  {showDate && (
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Calendar className="w-3 h-3" />
                      {reservation.date}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Clock className="w-3 h-3" />
                    {reservation.time}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Users className="w-3 h-3" />
                    {reservation.partySize}
                  </span>
                </div>

                <h4 className="font-display font-semibold text-lg text-foreground">
                  {reservation.guestName}
                </h4>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {reservation.guestPhone}
                  </span>
                </div>

                {reservation.notes && (
                  <p className="flex items-start gap-1 text-sm text-muted-foreground italic">
                    <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                    {reservation.notes}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleCancel(reservation)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
