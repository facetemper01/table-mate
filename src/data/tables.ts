import { Table } from "@/types/reservation";

export const restaurantTables: Table[] = [
  // Row 1 - 2-seater round tables
  { id: "t1", number: 1, seats: 2, x: 60, y: 80, shape: "round" },
  { id: "t2", number: 2, seats: 2, x: 160, y: 80, shape: "round" },
  { id: "t3", number: 3, seats: 2, x: 260, y: 80, shape: "round" },
  { id: "t4", number: 4, seats: 2, x: 360, y: 80, shape: "round" },
  
  // Row 2 - 4-seater square tables
  { id: "t5", number: 5, seats: 4, x: 60, y: 170, shape: "square" },
  { id: "t6", number: 6, seats: 4, x: 160, y: 170, shape: "square" },
  { id: "t7", number: 7, seats: 4, x: 260, y: 170, shape: "square" },
  { id: "t8", number: 8, seats: 4, x: 360, y: 170, shape: "square" },
  
  // Row 3 - 4-seater square tables
  { id: "t9", number: 9, seats: 4, x: 60, y: 260, shape: "square" },
  { id: "t10", number: 10, seats: 4, x: 160, y: 260, shape: "square" },
  { id: "t11", number: 11, seats: 4, x: 260, y: 260, shape: "square" },
  { id: "t12", number: 12, seats: 4, x: 360, y: 260, shape: "square" },
  
  // Row 4 - 4-seater round tables
  { id: "t13", number: 13, seats: 4, x: 60, y: 350, shape: "round" },
  { id: "t14", number: 14, seats: 4, x: 160, y: 350, shape: "round" },
  { id: "t15", number: 15, seats: 4, x: 260, y: 350, shape: "round" },
  { id: "t16", number: 16, seats: 4, x: 360, y: 350, shape: "round" },
  
  // Right side - 6-seater rectangular tables
  { id: "t17", number: 17, seats: 6, x: 480, y: 80, shape: "rectangle", width: 110, height: 55 },
  { id: "t18", number: 18, seats: 6, x: 480, y: 170, shape: "rectangle", width: 110, height: 55 },
  { id: "t19", number: 19, seats: 6, x: 480, y: 260, shape: "rectangle", width: 110, height: 55 },
  
  // Large tables at back
  { id: "t20", number: 20, seats: 8, x: 480, y: 350, shape: "rectangle", width: 130, height: 65 },
  { id: "t21", number: 21, seats: 10, x: 80, y: 440, shape: "rectangle", width: 160, height: 65 },
  { id: "t22", number: 22, seats: 10, x: 280, y: 440, shape: "rectangle", width: 160, height: 65 },
];
