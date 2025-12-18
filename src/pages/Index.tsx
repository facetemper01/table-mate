import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/restaurant/Header";
import { FloorPlan } from "@/components/restaurant/FloorPlan";
import { DraggableFloorPlan } from "@/components/restaurant/DraggableFloorPlan";
import { ReservationModal, PendingReservationModal } from "@/components/restaurant/ReservationModal";
import { ReservationList } from "@/components/restaurant/ReservationList";
import { DateSelector } from "@/components/restaurant/DateSelector";
import { TimeSelector } from "@/components/restaurant/TimeSelector";
import { EditLayoutModal } from "@/components/restaurant/EditLayoutModal";
import { DeletedReservationsModal } from "@/components/restaurant/DeletedReservationsModal";
import { useReservations } from "@/hooks/useReservations";
import { useDeletedReservationsLog } from "@/hooks/useDeletedReservationsLog";
import { useLanguage } from "@/contexts/LanguageContext";
import { TableWithStatus, Table, Reservation } from "@/types/reservation";
import { MapPin, ClipboardList, Settings2, MoreVertical, Trash2, Eye, EyeOff, History, Download, Plus, X, Users, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface PendingReservationData {
  guestName: string;
  guestPhone: string;
  partySize: number;
  time: string;
  notes: string;
  date: string;
}

const Index = () => {
  const { t } = useLanguage();
  const {
    reservations,
    tables,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    getTablesWithStatus,
    getVisibleTables,
    addReservation,
    updateReservation,
    cancelReservation,
    deleteAllReservations,
    getReservationsForDate,
    updateTableSeats,
    updateTableShape,
    updateTablePosition,
    combineTables,
    uncombineTable,
    loadTableLayout,
    undo,
    canUndo,
  } = useReservations();
  
  const { deletedLog, logDeletedReservation, logDeletedReservations, downloadLog, clearLog } = useDeletedReservationsLog();
  
  const [selectedTable, setSelectedTable] = useState<TableWithStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);
  const [isMovingTables, setIsMovingTables] = useState(false);
  const [showAllReservations, setShowAllReservations] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeletedLogModalOpen, setIsDeletedLogModalOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [pendingReservation, setPendingReservation] = useState<PendingReservationData | null>(null);
  const [switchingReservationId, setSwitchingReservationId] = useState<string | null>(null);
  
  const tablesWithStatus = getTablesWithStatus();
  const visibleTables = getVisibleTables();
  const visibleTablesWithStatus = tablesWithStatus.filter(t => 
    visibleTables.some(vt => vt.id === t.id)
  );
  const todaysReservations = getReservationsForDate(selectedDate);
  const displayedReservations = showAllReservations ? reservations : todaysReservations;
  const availableCount = visibleTablesWithStatus.filter(t => !t.isReserved).length;
  const reservedCount = visibleTablesWithStatus.filter(t => t.isReserved).length;
  
  const switchingReservation = switchingReservationId 
    ? reservations.find(r => r.id === switchingReservationId) 
    : null;
  
  const handleTableClick = (table: TableWithStatus) => {
    // If we have a pending reservation, assign it to this table
    if (pendingReservation && !table.isReserved) {
      addReservation({
        tableId: table.id,
        guestName: pendingReservation.guestName,
        guestPhone: pendingReservation.guestPhone,
        partySize: pendingReservation.partySize,
        date: pendingReservation.date,
        time: pendingReservation.time,
        notes: pendingReservation.notes,
      });
      toast.success(t("reservationAssigned", { table: table.displayName || table.number }));
      setPendingReservation(null);
      return;
    }
    
    // If we're switching tables, move the reservation
    if (switchingReservationId && !table.isReserved) {
      updateReservation(switchingReservationId, { tableId: table.id });
      toast.success(t("tableSwitched", { table: table.displayName || table.number }));
      setSwitchingReservationId(null);
      return;
    }
    
    // Normal table click - open modal
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const handleCancelReservation = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      logDeletedReservation(reservation);
      cancelReservation(reservationId);
      toast.success(t("reservationCancelled", { name: reservation.guestName }));
    }
  };

  const handleDeleteAllReservations = () => {
    logDeletedReservations(reservations);
    deleteAllReservations();
    setIsDeleteAllDialogOpen(false);
    toast.success(t("allReservationsDeleted"));
  };

  const handleLoadPreset = (presetTables: Table[]) => {
    loadTableLayout(presetTables);
  };

  const handleClearLog = () => {
    clearLog();
    toast.success(t("logCleared"));
  };

  const handleCreatePendingReservation = (data: PendingReservationData) => {
    setPendingReservation(data);
    toast.success(t("pendingReservation") + " - " + t("pendingReservationMsg"));
  };

  const handleSwitchTable = (reservationId: string) => {
    setSwitchingReservationId(reservationId);
  };

  const handleUndo = () => {
    const success = undo();
    if (success) {
      toast.success(t("changeUndone"));
    } else {
      toast.info(t("noChangesToUndo"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Pending/Switching Reservation Banner */}
        {(pendingReservation || switchingReservationId) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-4 rounded-lg flex items-center justify-between ${
              pendingReservation ? "bg-warning/20 border border-warning" : "bg-primary/20 border border-primary"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <div>
                <p className="font-semibold">
                  {pendingReservation ? t("pendingReservation") : t("switchingTable")}
                  {pendingReservation && `: ${pendingReservation.guestName} (${pendingReservation.partySize} ${t("guests")})`}
                  {switchingReservation && `: ${switchingReservation.guestName}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {pendingReservation ? t("pendingReservationMsg") : t("switchingTableMsg")}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPendingReservation(null);
                setSwitchingReservationId(null);
              }}
            >
              <X className="w-4 h-4 mr-1" />
              {pendingReservation ? t("cancelPending") : t("cancelSwitch")}
            </Button>
          </motion.div>
        )}

        {/* Date & Time Selector & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <TimeSelector selectedTime={selectedTime} onTimeChange={setSelectedTime} />
            <Button
              onClick={() => setIsPendingModalOpen(true)}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t("newReservation")}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              disabled={!canUndo}
              title={t("undoAction")}
              className="h-10 w-10"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-lg">
              <span className="text-2xl font-display font-bold">{availableCount}</span>
              <span className="text-sm font-body">{t("available")}</span>
            </div>
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-lg">
              <span className="text-2xl font-display font-bold">{reservedCount}</span>
              <span className="text-sm font-body">{t("reserved")}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Floor Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">{t("floorPlan")}</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLayoutModalOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings2 className="w-4 h-4 mr-1" />
                {t("editLayout")}
              </Button>
            </div>
            {isMovingTables ? (
              <DraggableFloorPlan 
                tables={visibleTables} 
                onPositionChange={updateTablePosition}
                onDone={() => setIsMovingTables(false)}
              />
            ) : (
              <>
                <FloorPlan tables={visibleTablesWithStatus} onTableClick={handleTableClick} selectedTable={selectedTable} />
                <p className="text-sm text-muted-foreground mt-3 font-body text-center">
                  {t("clickOnTable")}
                </p>
              </>
            )}
          </motion.div>

          {/* Reservations List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">
                  {showAllReservations ? t("allReservations") : t("todaysReservations")}
                </h2>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border z-50">
                  <DropdownMenuItem onClick={() => setShowAllReservations(!showAllReservations)}>
                    {showAllReservations ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        {t("todaysReservations")}
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        {t("allReservations")}
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsDeletedLogModalOpen(true)}>
                    <History className="w-4 h-4 mr-2" />
                    {t("viewDeletedReservations")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadLog()}>
                    <Download className="w-4 h-4 mr-2" />
                    {t("downloadLog")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsDeleteAllDialogOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("deleteAllReservations")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="bg-card/50 border border-border rounded-2xl p-4 max-h-[480px] overflow-y-auto">
              <ReservationList 
                reservations={displayedReservations} 
                onCancel={handleCancelReservation}
                showDate={showAllReservations}
              />
            </div>
          </motion.div>
        </div>
      </main>

      <ReservationModal
        table={selectedTable}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTable(null);
        }}
        onReserve={addReservation}
        onUpdate={updateReservation}
        onCancel={handleCancelReservation}
        onSwitchTable={handleSwitchTable}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />

      <PendingReservationModal
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)}
        onCreatePending={handleCreatePendingReservation}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
      />

      <EditLayoutModal 
        tables={visibleTables} 
        isOpen={isLayoutModalOpen} 
        onClose={() => setIsLayoutModalOpen(false)} 
        onSave={updateTableSeats} 
        onCombineTables={combineTables} 
        onUncombineTable={uncombineTable}
        onShapeChange={updateTableShape}
        onStartMoveTables={() => setIsMovingTables(true)}
        onLoadPreset={handleLoadPreset}
      />

      <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteAllReservations")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDeleteAll")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAllReservations}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DeletedReservationsModal
        isOpen={isDeletedLogModalOpen}
        onClose={() => setIsDeletedLogModalOpen(false)}
        deletedReservations={deletedLog}
        onDownload={downloadLog}
        onClearLog={handleClearLog}
      />
    </div>
  );
};

export default Index;
