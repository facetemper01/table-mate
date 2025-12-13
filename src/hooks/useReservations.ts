import { useState, useCallback } from "react";
import { Reservation, TableWithStatus } from "@/types/reservation";
import { restaurantTables } from "@/data/tables";

// Sample initial reservations
const initialReservations: Reservation[] = [
  {
    id: "r1",
    tableId: "t2",
    guestName: "John Smith",
    guestPhone: "(555) 123-4567",
    guestEmail: "john@example.com",
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
    guestEmail: "sarah@example.com",
    partySize: 4,
    date: new Date().toISOString().split("T")[0],
    time: "20:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r3",
    tableId: "t7",
    guestName: "Business Group",
    guestPhone: "(555) 456-7890",
    guestEmail: "corp@example.com",
    partySize: 6,
    date: new Date().toISOString().split("T")[0],
    time: "18:30",
    notes: "Corporate dinner - wine pairing requested",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r4",
    tableId: "t12",
    guestName: "Martinez Family",
    guestPhone: "(555) 321-0987",
    guestEmail: "martinez@example.com",
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

  const getTablesWithStatus = useCallback((): TableWithStatus[] => {
    return restaurantTables.map((table) => {
      const reservation = reservations.find(
        (r) => r.tableId === table.id && r.date === selectedDate
      );
      return {
        ...table,
        isReserved: !!reservation,
        currentReservation: reservation,
      };
    });
  }, [reservations, selectedDate]);

  const addReservation = useCallback((reservation: Omit<Reservation, "id" | "createdAt">) => {
    const newReservation: Reservation = {
      ...reservation,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [...prev, newReservation]);
    return newReservation;
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
    getTablesWithStatus,
    addReservation,
    cancelReservation,
    getReservationsForDate,
  };
}
