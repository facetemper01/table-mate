import { TableWithStatus } from "@/types/reservation";
import { TableShape } from "./TableShape";
import { motion } from "framer-motion";

interface FloorPlanProps {
  tables: TableWithStatus[];
  onTableClick: (table: TableWithStatus) => void;
  selectedTable: TableWithStatus | null;
}

export function FloorPlan({ tables, onTableClick, selectedTable }: FloorPlanProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[480px] bg-secondary/30 rounded-2xl border border-border overflow-hidden"
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Tables */}
      {tables.map((table) => (
        <TableShape
          key={table.id}
          table={table}
          onClick={() => onTableClick(table)}
          isSelected={selectedTable?.id === table.id}
        />
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex items-center gap-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-success/20 border-2 border-success" />
          <span className="text-xs text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-destructive/20 border-2 border-destructive" />
          <span className="text-xs text-muted-foreground">Reserved</span>
        </div>
      </div>
    </motion.div>
  );
}
