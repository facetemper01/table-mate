import { useState, useCallback } from "react";
import { Reservation, TableWithStatus, Table } from "@/types/reservation";
import { restaurantTables as defaultTables } from "@/data/tables";

// Reservation duration in minutes (1.5 hours)
const RESERVATION_DURATION = 90;

// Helper to convert time string to minutes since midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Check if two time ranges overlap
const timeRangesOverlap = (
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean => {
  return start1 < end2 && end1 > start2;
};

// Sample initial reservations
const initialReservations: Reservation[] = [
  {
    id: "r1",
    tableId: "t2",
    guestName: "John Smith",
    guestPhone: "(555) 123-4567",
    partySize: 2,
    date: new Date().toISOString().split("T")[0],
    time: "19:00",
    notes: "Anniversary dinner",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r2",
    tableId: "t5",
    guestName: "Sarah Johnson",
    guestPhone: "(555) 987-6543",
    partySize: 4,
    date: new Date().toISOString().split("T")[0],
    time: "20:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r3",
    tableId: "t17",
    guestName: "Business Group",
    guestPhone: "(555) 456-7890",
    partySize: 6,
    date: new Date().toISOString().split("T")[0],
    time: "18:30",
    notes: "Corporate dinner - wine pairing requested",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r4",
    tableId: "t20",
    guestName: "Martinez Family",
    guestPhone: "(555) 321-0987",
    partySize: 8,
    date: new Date().toISOString().split("T")[0],
    time: "19:30",
    notes: "Birthday celebration",
    createdAt: new Date().toISOString(),
  },
];

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [tables, setTables] = useState<Table[]>(defaultTables);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("19:00");

  const getTablesWithStatus = useCallback((): TableWithStatus[] => {
    const selectedStartMinutes = timeToMinutes(selectedTime);
    const selectedEndMinutes = selectedStartMinutes + RESERVATION_DURATION;

    return tables.map((table) => {
      // Find any reservation that overlaps with the selected time window
      const overlappingReservation = reservations.find((r) => {
        if (r.tableId !== table.id || r.date !== selectedDate) return false;

        const resStartMinutes = timeToMinutes(r.time);
        const resEndMinutes = resStartMinutes + RESERVATION_DURATION;

        return timeRangesOverlap(
          selectedStartMinutes,
          selectedEndMinutes,
          resStartMinutes,
          resEndMinutes
        );
      });

      return {
        ...table,
        isReserved: !!overlappingReservation,
        currentReservation: overlappingReservation,
      };
    });
  }, [reservations, tables, selectedDate, selectedTime]);

  const addReservation = useCallback((reservation: Omit<Reservation, "id" | "createdAt">) => {
    const newReservation: Reservation = {
      ...reservation,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [...prev, newReservation]);
    return newReservation;
  }, []);

  const updateReservation = useCallback((reservationId: string, updates: Partial<Omit<Reservation, "id" | "createdAt">>) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, ...updates } : r
      )
    );
  }, []);

  const cancelReservation = useCallback((reservationId: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== reservationId));
  }, []);

  const getReservationsForDate = useCallback(
    (date: string) => {
      return reservations.filter((r) => r.date === date);
    },
    [reservations]
  );

  const updateTableSeats = useCallback((updates: { id: string; seats: number }[]) => {
    setTables((prev) =>
      prev.map((table) => {
        const update = updates.find((u) => u.id === table.id);
        return update ? { ...table, seats: update.seats } : table;
      })
    );
  }, []);

  const updateTableShape = useCallback((tableId: string, shape: 'round' | 'square') => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId ? { ...table, shape } : table
      )
    );
  }, []);

  const updateTablePosition = useCallback((tableId: string, x: number, y: number) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId ? { ...table, x, y } : table
      )
    );
  }, []);

  const combineTables = useCallback((tableIds: string[]) => {
    if (tableIds.length < 2) return;

    setTables((prev) => {
      const tablesToCombine = prev.filter((t) => tableIds.includes(t.id));
      const tableNumbers = tablesToCombine.map((t) => t.number).sort((a, b) => a - b);
      const displayName = tableNumbers.join("/");
      const totalSeats = tablesToCombine.reduce((sum, t) => sum + t.seats, 0);
      
      // Use the first table's position but update its properties
      const primaryTableId = tableIds[0];
      
      return prev.map((table) => {
        if (table.id === primaryTableId) {
          return {
            ...table,
            combinedWith: tableIds.filter((id) => id !== primaryTableId),
            displayName,
            seats: totalSeats,
          };
        }
        // Hide other combined tables by marking them
        if (tableIds.includes(table.id) && table.id !== primaryTableId) {
          return {
            ...table,
            combinedWith: [primaryTableId],
            displayName: undefined,
          };
        }
        return table;
      });
    });
  }, []);

  const uncombineTable = useCallback((tableId: string) => {
    setTables((prev) => {
      const table = prev.find((t) => t.id === tableId);
      if (!table?.combinedWith) return prev;

      const allCombinedIds = [tableId, ...table.combinedWith];
      const originalTables = defaultTables.filter((t) => allCombinedIds.includes(t.id));

      return prev.map((t) => {
        const original = originalTables.find((ot) => ot.id === t.id);
        if (original) {
          return { ...original };
        }
        return t;
      });
    });
  }, []);

  // Filter out secondary combined tables from display
  const getVisibleTables = useCallback((): Table[] => {
    return tables.filter((table) => {
      // If table has combinedWith and it's not the primary (no displayName), hide it
      if (table.combinedWith && table.combinedWith.length > 0 && !table.displayName) {
        return false;
      }
      return true;
    });
  }, [tables]);

  return {
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
    getReservationsForDate,
    updateTableSeats,
    updateTableShape,
    updateTablePosition,
    combineTables,
    uncombineTable,
  };
}
