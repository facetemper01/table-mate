export interface TableOriginalPosition {
  x: number;
  y: number;
  seats: number;
  shape?: 'round' | 'square' | 'rectangle';
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  x: number;
  y: number;
  shape: 'round' | 'square' | 'rectangle';
  width?: number;
  height?: number;
  combinedWith?: string[]; // IDs of tables this is combined with
  displayName?: string; // e.g., "5/6" for combined tables
  originalPositions?: Record<string, TableOriginalPosition>; // Store original positions when combining
}

export interface Reservation {
  id: string;
  tableId: string;
  guestName: string;
  guestPhone: string;
  partySize: number;
  date: string;
  time: string;
  notes?: string;
  createdAt: string;
}

export interface TableWithStatus extends Table {
  isReserved: boolean;
  currentReservation?: Reservation;
}
