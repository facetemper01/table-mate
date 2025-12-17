import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "no";

interface Translations {
  [key: string]: {
    en: string;
    no: string;
  };
}

const translations: Translations = {
  // Header
  "tableReservations": { en: "Table Reservations", no: "Bordreservasjoner" },
  "openNow": { en: "Open Now", no: "Åpent nå" },
  
  // Stats
  "available": { en: "Available", no: "Ledig" },
  "reserved": { en: "Reserved", no: "Opptatt" },
  
  // Floor Plan
  "floorPlan": { en: "Floor Plan", no: "Plantegning" },
  "editLayout": { en: "Edit Layout", no: "Rediger layout" },
  "clickOnTable": { en: "Click on a table to make or view a reservation • Reservations are 1.5 hours", no: "Klikk på et bord for å reservere eller se reservasjon • Reservasjoner er 1,5 timer" },
  
  // Reservations
  "todaysReservations": { en: "Today's Reservations", no: "Dagens reservasjoner" },
  "allReservations": { en: "All Reservations", no: "Alle reservasjoner" },
  "noReservations": { en: "No reservations for this date", no: "Ingen reservasjoner for denne datoen" },
  "noReservationsAll": { en: "No reservations", no: "Ingen reservasjoner" },
  "table": { en: "Table", no: "Bord" },
  "editReservations": { en: "Edit Reservations", no: "Rediger reservasjoner" },
  "deleteAllReservations": { en: "Delete All Reservations", no: "Slett alle reservasjoner" },
  "confirmDeleteAll": { en: "Are you sure you want to delete all reservations? This action cannot be undone.", no: "Er du sikker på at du vil slette alle reservasjoner? Denne handlingen kan ikke angres." },
  "downloadLog": { en: "Download Deleted Log", no: "Last ned slettede logg" },
  "cancel": { en: "Cancel", no: "Avbryt" },
  "delete": { en: "Delete", no: "Slett" },
  "reservationCancelled": { en: "Reservation for {name} cancelled", no: "Reservasjon for {name} avlyst" },
  "allReservationsDeleted": { en: "All reservations deleted", no: "Alle reservasjoner slettet" },
  
  // Edit Layout Modal
  "editTableLayout": { en: "Edit Table Layout", no: "Rediger bordoppsett" },
  "adjustSeats": { en: "Adjust seats, shapes, and combine tables", no: "Juster seter, former og kombiner bord" },
  "moveTables": { en: "Move Tables", no: "Flytt bord" },
  "combineTables": { en: "Combine Tables", no: "Kombiner bord" },
  "combine": { en: "Combine", no: "Kombiner" },
  "selectTables": { en: "Select multiple tables below to combine them", no: "Velg flere bord nedenfor for å kombinere dem" },
  "split": { en: "Split", no: "Del" },
  "seats": { en: "Seats", no: "Seter" },
  "saveChanges": { en: "Save Changes", no: "Lagre endringer" },
  "updated": { en: "Updated {count} table(s)", no: "Oppdatert {count} bord" },
  "tablesCombined": { en: "Tables combined successfully", no: "Bord kombinert" },
  "tableUncombined": { en: "Table uncombined", no: "Bord delt" },
  "selectAtLeast2": { en: "Select at least 2 tables to combine", no: "Velg minst 2 bord for å kombinere" },
  
  // Layout Presets
  "layoutPresets": { en: "Layout Presets", no: "Layoutmaler" },
  "saveAsPreset": { en: "Save as Preset", no: "Lagre som mal" },
  "loadPreset": { en: "Load Preset", no: "Last inn mal" },
  "deletePreset": { en: "Delete Preset", no: "Slett mal" },
  "presetName": { en: "Preset Name", no: "Malnavn" },
  "noPresets": { en: "No saved presets", no: "Ingen lagrede maler" },
  "presetSaved": { en: "Preset saved", no: "Mal lagret" },
  "presetLoaded": { en: "Preset loaded", no: "Mal lastet" },
  "presetDeleted": { en: "Preset deleted", no: "Mal slettet" },
  "enterPresetName": { en: "Enter preset name", no: "Skriv inn malnavn" },
  
  // Reservation Modal
  "makeReservation": { en: "Make Reservation", no: "Lag reservasjon" },
  "viewReservation": { en: "View Reservation", no: "Se reservasjon" },
  "currentlyReserved": { en: "Currently reserved", no: "For øyeblikket reservert" },
  "guestName": { en: "Guest Name", no: "Gjestenavn" },
  "phone": { en: "Phone", no: "Telefon" },
  "partySize": { en: "Party Size", no: "Antall gjester" },
  "notes": { en: "Notes", no: "Notater" },
  "confirmReservation": { en: "Confirm Reservation", no: "Bekreft reservasjon" },
  "cancelReservation": { en: "Cancel Reservation", no: "Avlys reservasjon" },
  "close": { en: "Close", no: "Lukk" },
  "reservationConfirmed": { en: "Reservation confirmed for {name}", no: "Reservasjon bekreftet for {name}" },
  
  // Date & Time
  "date": { en: "Date", no: "Dato" },
  "time": { en: "Time", no: "Tid" },
  "done": { en: "Done", no: "Ferdig" },
  
  // Deleted Reservations
  "deletedReservations": { en: "Deleted Reservations", no: "Slettede reservasjoner" },
  "deletedReservationsDesc": { en: "History of all cancelled and deleted reservations", no: "Historikk over alle avlyste og slettede reservasjoner" },
  "noDeletedReservations": { en: "No deleted reservations", no: "Ingen slettede reservasjoner" },
  "deletedAt": { en: "Deleted At", no: "Slettet" },
  "clearLog": { en: "Clear Log", no: "Tøm logg" },
  "viewDeletedReservations": { en: "View Deleted Reservations", no: "Se slettede reservasjoner" },
  "logCleared": { en: "Log cleared", no: "Logg tømt" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("restaurant_language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("restaurant_language", language);
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[key]?.[language] || key;
    if (params) {
      return Object.entries(params).reduce(
        (str, [key, value]) => str.replace(`{${key}}`, String(value)),
        translation
      );
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
