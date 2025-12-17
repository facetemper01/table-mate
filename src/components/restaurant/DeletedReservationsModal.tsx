import { DeletedReservation } from "@/hooks/useDeletedReservationsLog";
import { restaurantTables } from "@/data/tables";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2, History } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DeletedReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedReservations: DeletedReservation[];
  onDownload: () => void;
  onClearLog: () => void;
}

export function DeletedReservationsModal({
  isOpen,
  onClose,
  deletedReservations,
  onDownload,
  onClearLog,
}: DeletedReservationsModalProps) {
  const { t } = useLanguage();

  const getTableNumber = (tableId: string) => {
    return restaurantTables.find((t) => t.id === tableId)?.number || tableId;
  };

  const formatDate = (dateStr: string) => {
    return dateStr;
  };

  const formatDeletedAt = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-card border-border max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            {t("deletedReservations")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("deletedReservationsDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-2">
          <Button variant="outline" size="sm" onClick={onDownload} className="gap-1">
            <Download className="w-4 h-4" />
            {t("downloadLog")}
          </Button>
          {deletedReservations.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearLog}
              className="gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              {t("clearLog")}
            </Button>
          )}
        </div>

        {deletedReservations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-body">{t("noDeletedReservations")}</p>
          </div>
        ) : (
          <ScrollArea className="flex-1 max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">{t("deletedAt")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("date")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("time")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("table")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("guestName")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("phone")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("partySize")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...deletedReservations].reverse().map((reservation) => (
                  <TableRow key={`${reservation.id}-${reservation.deletedAt}`} className="border-border">
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDeletedAt(reservation.deletedAt)}
                    </TableCell>
                    <TableCell>{formatDate(reservation.date)}</TableCell>
                    <TableCell>{reservation.time}</TableCell>
                    <TableCell>
                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-sm font-medium">
                        {getTableNumber(reservation.tableId)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{reservation.guestName}</TableCell>
                    <TableCell>{reservation.guestPhone}</TableCell>
                    <TableCell>{reservation.partySize}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}

        <div className="flex justify-end pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
