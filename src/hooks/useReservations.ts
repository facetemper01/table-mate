import { useState, useCallback, useEffect } from "react";
import { Reservation, TableWithStatus, Table } from "@/types/reservation";
import { restaurantTables as defaultTables } from "@/data/tables";

// LocalStorage keys
const STORAGE_KEYS = {
  RESERVATIONS: "restaurant_reservations",
  TABLES: "restaurant_tables",
};

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

// Load from localStorage with fallback
const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error(`Error loading ${key} from localStorage:`, e);
  }
  return fallback;
};

// Save to localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
};

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    loadFromStorage(STORAGE_KEYS.RESERVATIONS, [])
  );
  const [tables, setTables] = useState<Table[]>(() =>
    loadFromStorage(STORAGE_KEYS.TABLES, defaultTables)
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("19:00");

  // Persist reservations to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations);
  }, [reservations]);

  // Persist tables to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TABLES, tables);
  }, [tables]);

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

  const deleteAllReservations = useCallback(() => {
    setReservations([]);
  }, []);

  const getReservationsForDate = useCallback(
    (date: string) => {
      return reservations.filter((r) => r.date === date);
    },
    [reservations]
  );

  const loadTableLayout = useCallback((newTables: Table[]) => {
    setTables(newTables);
  }, []);

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
      
      // Store original positions for all tables being combined
      const originalPositions: Record<string, { x: number; y: number; seats: number; shape?: 'round' | 'square' | 'rectangle' }> = {};
      tablesToCombine.forEach((t) => {
        originalPositions[t.id] = { x: t.x, y: t.y, seats: t.seats, shape: t.shape };
      });
      
      return prev.map((table) => {
        if (table.id === primaryTableId) {
          return {
            ...table,
            combinedWith: tableIds.filter((id) => id !== primaryTableId),
            displayName,
            seats: totalSeats,
            originalPositions,
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
      const originalPositions = table.originalPositions || {};

      return prev.map((t) => {
        if (allCombinedIds.includes(t.id)) {
          const original = originalPositions[t.id];
          const defaultTable = defaultTables.find((dt) => dt.id === t.id);
          return {
            ...t,
            x: original?.x ?? defaultTable?.x ?? t.x,
            y: original?.y ?? defaultTable?.y ?? t.y,
            seats: original?.seats ?? defaultTable?.seats ?? t.seats,
            shape: original?.shape ?? defaultTable?.shape ?? t.shape,
            combinedWith: undefined,
            displayName: undefined,
            originalPositions: undefined,
          };
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
    deleteAllReservations,
    getReservationsForDate,
    updateTableSeats,
    updateTableShape,
    updateTablePosition,
    combineTables,
    uncombineTable,
    loadTableLayout,
  };
}
