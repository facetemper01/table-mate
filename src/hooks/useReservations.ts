import { useState, useCallback } from "react";
import { Reservation, TableWithStatus } from "@/types/reservation";
import { restaurantTables } from "@/data/tables";

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
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("19:00");

  const getTablesWithStatus = useCallback((): TableWithStatus[] => {
    const selectedStartMinutes = timeToMinutes(selectedTime);
    const selectedEndMinutes = selectedStartMinutes + RESERVATION_DURATION;

    return restaurantTables.map((table) => {
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
  }, [reservations, selectedDate, selectedTime]);

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

  return {
    reservations,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    getTablesWithStatus,
    addReservation,
    updateReservation,
    cancelReservation,
    getReservationsForDate,
  };
}
