import { Table } from "@/types/reservation";

export const restaurantTables: Table[] = [
  // Front section - smaller tables for couples
  { id: "t1", number: 1, seats: 2, x: 80, y: 100, shape: "round" },
  { id: "t2", number: 2, seats: 2, x: 200, y: 100, shape: "round" },
  { id: "t3", number: 3, seats: 2, x: 320, y: 100, shape: "round" },
  
  // Middle section - 4-seater tables
  { id: "t4", number: 4, seats: 4, x: 80, y: 220, shape: "square" },
  { id: "t5", number: 5, seats: 4, x: 200, y: 220, shape: "square" },
  { id: "t6", number: 6, seats: 4, x: 320, y: 220, shape: "square" },
  
  // Side section - rectangular tables
  { id: "t7", number: 7, seats: 6, x: 460, y: 100, shape: "rectangle", width: 120, height: 60 },
  { id: "t8", number: 8, seats: 6, x: 460, y: 220, shape: "rectangle", width: 120, height: 60 },
  
  // Back section - larger round tables
  { id: "t9", number: 9, seats: 4, x: 80, y: 340, shape: "round" },
  { id: "t10", number: 10, seats: 4, x: 200, y: 340, shape: "round" },
  { id: "t11", number: 11, seats: 4, x: 320, y: 340, shape: "round" },
  { id: "t12", number: 12, seats: 8, x: 460, y: 340, shape: "rectangle", width: 140, height: 70 },
];
