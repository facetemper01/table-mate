import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/restaurant/Header";
import { FloorPlan } from "@/components/restaurant/FloorPlan";
import { ReservationModal } from "@/components/restaurant/ReservationModal";
import { ReservationList } from "@/components/restaurant/ReservationList";
import { DateSelector } from "@/components/restaurant/DateSelector";
import { TimeSelector } from "@/components/restaurant/TimeSelector";
import { EditLayoutModal } from "@/components/restaurant/EditLayoutModal";
import { useReservations } from "@/hooks/useReservations";
import { TableWithStatus } from "@/types/reservation";
import { MapPin, ClipboardList, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
const Index = () => {
  const {
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
    getReservationsForDate,
    updateTableSeats,
    combineTables,
    uncombineTable,
  } = useReservations();
  const [selectedTable, setSelectedTable] = useState<TableWithStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);
  const tablesWithStatus = getTablesWithStatus();
  const visibleTables = getVisibleTables();
  const visibleTablesWithStatus = tablesWithStatus.filter(t => 
    visibleTables.some(vt => vt.id === t.id)
  );
  const reservations = getReservationsForDate(selectedDate);
  const availableCount = visibleTablesWithStatus.filter(t => !t.isReserved).length;
  const reservedCount = visibleTablesWithStatus.filter(t => t.isReserved).length;
  const handleTableClick = (table: TableWithStatus) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };
  return <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Date & Time Selector & Stats */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <TimeSelector selectedTime={selectedTime} onTimeChange={setSelectedTime} />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-lg">
              <span className="text-2xl font-display font-bold">{availableCount}</span>
              <span className="text-sm font-body">Ledig</span>
            </div>
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-lg">
              <span className="text-2xl font-display font-bold">{reservedCount}</span>
              <span className="text-sm font-body">Opptatt
            </span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Floor Plan */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Floor Plan</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsLayoutModalOpen(true)} className="text-muted-foreground hover:text-foreground">
                <Settings2 className="w-4 h-4 mr-1" />
                Edit Layout
              </Button>
            </div>
            <FloorPlan tables={visibleTablesWithStatus} onTableClick={handleTableClick} selectedTable={selectedTable} />
            <p className="text-sm text-muted-foreground mt-3 font-body text-center">
              Click on a table to make or view a reservation • Reservations are 1.5 hours
            </p>
          </motion.div>

          {/* Reservations List */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }} className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Today's Reservations</h2>
            </div>
            <div className="bg-card/50 border border-border rounded-2xl p-4 max-h-[480px] overflow-y-auto">
              <ReservationList reservations={reservations} onCancel={cancelReservation} />
            </div>
          </motion.div>
        </div>
      </main>

      <ReservationModal table={selectedTable} isOpen={isModalOpen} onClose={() => {
      setIsModalOpen(false);
      setSelectedTable(null);
    }} onReserve={addReservation} onUpdate={updateReservation} onCancel={cancelReservation} selectedDate={selectedDate} selectedTime={selectedTime} />

      <EditLayoutModal tables={visibleTables} isOpen={isLayoutModalOpen} onClose={() => setIsLayoutModalOpen(false)} onSave={updateTableSeats} onCombineTables={combineTables} onUncombineTable={uncombineTable} />
    </div>;
};
export default Index;