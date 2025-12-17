import { UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const { t } = useLanguage();
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground font-mono">
              La Maison
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              {t("tableReservations")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-body">{t("openNow")}</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
