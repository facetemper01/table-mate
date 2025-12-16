import { useState, useRef } from "react";
import { Table } from "@/types/reservation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Users, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DraggableFloorPlanProps {
  tables: Table[];
  onPositionChange: (tableId: string, x: number, y: number) => void;
  onDone: () => void;
}

const TABLE_SIZE = 70;

export function DraggableFloorPlan({ tables, onPositionChange, onDone }: DraggableFloorPlanProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, table: Table) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setDraggingId(table.id);
    setDragOffset({
      x: e.clientX - rect.left - table.x,
      y: e.clientY - rect.top - table.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(rect.width - TABLE_SIZE, e.clientX - rect.left - dragOffset.x));
    const newY = Math.max(0, Math.min(rect.height - TABLE_SIZE, e.clientY - rect.top - dragOffset.y));
    
    onPositionChange(draggingId, Math.round(newX), Math.round(newY));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const getShapeClasses = (table: Table) => {
    const baseClasses = cn(
      "absolute cursor-move transition-colors duration-200 flex flex-col items-center justify-center font-body text-sm",
      "shadow-lg bg-primary/20 border-2 border-primary",
      draggingId === table.id && "ring-4 ring-primary ring-offset-2 ring-offset-background z-10"
    );

    return table.shape === "round" ? cn(baseClasses, "rounded-full") : cn(baseClasses, "rounded-lg");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Drag tables to reposition them
        </p>
        <Button onClick={onDone} className="gap-2">
          <Check className="w-4 h-4" />
          Done
        </Button>
      </div>
      
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-[480px] bg-secondary/30 rounded-2xl border-2 border-dashed border-primary/50 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-edit" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-edit)" />
          </svg>
        </div>

        {/* Tables */}
        {tables.map((table) => (
          <div
            key={table.id}
            className={getShapeClasses(table)}
            style={{
              left: table.x,
              top: table.y,
              width: TABLE_SIZE,
              height: TABLE_SIZE,
            }}
            onMouseDown={(e) => handleMouseDown(e, table)}
          >
            <span className="font-display font-semibold text-lg text-primary">
              {table.displayName || table.number}
            </span>
            <div className="flex items-center gap-1 text-xs text-primary/80">
              <Users className="w-3 h-3" />
              <span>{table.seats}</span>
            </div>
          </div>
        ))}

        {/* Edit mode indicator */}
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
          Edit Mode
        </div>
      </motion.div>
    </div>
  );
}