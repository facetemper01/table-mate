import { useState, useEffect, useCallback } from "react";
import { Table } from "@/types/reservation";

export interface LayoutPreset {
  id: string;
  name: string;
  tables: Table[];
  createdAt: string;
}

const STORAGE_KEY = "restaurant_layout_presets";

const loadPresets = (): LayoutPreset[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const savePresets = (presets: LayoutPreset[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
};

export function useLayoutPresets() {
  const [presets, setPresets] = useState<LayoutPreset[]>(loadPresets);

  useEffect(() => {
    savePresets(presets);
  }, [presets]);

  const addPreset = useCallback((name: string, tables: Table[]) => {
    const newPreset: LayoutPreset = {
      id: `preset_${Date.now()}`,
      name,
      tables: JSON.parse(JSON.stringify(tables)), // Deep clone
      createdAt: new Date().toISOString(),
    };
    setPresets((prev) => [...prev, newPreset]);
    return newPreset;
  }, []);

  const deletePreset = useCallback((presetId: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== presetId));
  }, []);

  const updatePresetName = useCallback((presetId: string, newName: string) => {
    setPresets((prev) =>
      prev.map((p) => (p.id === presetId ? { ...p, name: newName } : p))
    );
  }, []);

  return {
    presets,
    addPreset,
    deletePreset,
    updatePresetName,
  };
}
