export interface Table {
  id: string;
  number: number;
  seats: number;
  x: number;
  y: number;
  shape: 'round' | 'square' | 'rectangle';
  width?: number;
  height?: number;
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
