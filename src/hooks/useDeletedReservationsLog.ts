import { useState, useEffect, useCallback } from "react";
import { Reservation } from "@/types/reservation";

export interface DeletedReservation extends Reservation {
  deletedAt: string;
}

const STORAGE_KEY = "restaurant_deleted_reservations";

const loadLog = (): DeletedReservation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLog = (log: DeletedReservation[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
};

export function useDeletedReservationsLog() {
  const [deletedLog, setDeletedLog] = useState<DeletedReservation[]>(loadLog);

  useEffect(() => {
    saveLog(deletedLog);
  }, [deletedLog]);

  const logDeletedReservation = useCallback((reservation: Reservation) => {
    const deletedEntry: DeletedReservation = {
      ...reservation,
      deletedAt: new Date().toISOString(),
    };
    setDeletedLog((prev) => [...prev, deletedEntry]);
  }, []);

  const logDeletedReservations = useCallback((reservations: Reservation[]) => {
    const deletedEntries: DeletedReservation[] = reservations.map((r) => ({
      ...r,
      deletedAt: new Date().toISOString(),
    }));
    setDeletedLog((prev) => [...prev, ...deletedEntries]);
  }, []);

  const downloadLog = useCallback(() => {
    const logContent = deletedLog
      .map((r) => {
        return `[${r.deletedAt}] Reservation ID: ${r.id}
  Guest: ${r.guestName}
  Phone: ${r.guestPhone}
  Date: ${r.date}
  Time: ${r.time}
  Party Size: ${r.partySize}
  Table ID: ${r.tableId}
  Notes: ${r.notes || "None"}
  Created At: ${r.createdAt}
----------------------------------------`;
      })
      .join("\n\n");

    const blob = new Blob([logContent || "No deleted reservations"], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deleted_reservations_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [deletedLog]);

  const clearLog = useCallback(() => {
    setDeletedLog([]);
  }, []);

  return {
    deletedLog,
    logDeletedReservation,
    logDeletedReservations,
    downloadLog,
    clearLog,
  };
}
