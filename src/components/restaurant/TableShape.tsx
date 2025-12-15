import { TableWithStatus } from "@/types/reservation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface TableShapeProps {
  table: TableWithStatus;
  onClick: () => void;
  isSelected: boolean;
}

export function TableShape({ table, onClick, isSelected }: TableShapeProps) {
  const baseSize = 70;
  const width = table.width || baseSize;
  const height = table.height || baseSize;

  const getShapeClasses = () => {
    const baseClasses = cn(
      "absolute cursor-pointer transition-all duration-300 flex flex-col items-center justify-center font-body text-sm",
      "shadow-lg hover:shadow-xl",
      table.isReserved
        ? "bg-destructive/20 border-2 border-destructive"
        : "bg-success/20 border-2 border-success",
      isSelected && "ring-4 ring-primary ring-offset-2 ring-offset-background",
      !table.isReserved && "hover:scale-105"
    );

    switch (table.shape) {
      case "round":
        return cn(baseClasses, "rounded-full");
      case "square":
        return cn(baseClasses, "rounded-lg");
      case "rectangle":
        return cn(baseClasses, "rounded-lg");
      default:
        return baseClasses;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: parseInt(table.id.slice(1)) * 0.05 }}
      className={getShapeClasses()}
      style={{
        left: table.x,
        top: table.y,
        width: width,
        height: height,
      }}
      onClick={onClick}
      whileHover={{ scale: table.isReserved ? 1 : 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <span
        className={cn(
          "font-display font-semibold",
          table.displayName ? "text-base" : "text-lg",
          table.isReserved ? "text-destructive" : "text-success"
        )}
      >
        {table.displayName || table.number}
      </span>
      <div
        className={cn(
          "flex items-center gap-1 text-xs",
          table.isReserved ? "text-destructive/80" : "text-success/80"
        )}
      >
        <Users className="w-3 h-3" />
        <span>{table.seats}</span>
      </div>
      {table.isReserved && table.currentReservation && (
        <span className="text-[10px] text-destructive/70 mt-0.5 truncate max-w-full px-1">
          {table.currentReservation.time}
        </span>
      )}
    </motion.div>
  );
}
