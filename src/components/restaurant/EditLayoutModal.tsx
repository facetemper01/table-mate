import { useState } from "react";
import { Table } from "@/types/reservation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Users, Save, Link2, Unlink, Move, Circle, Square, FolderOpen, Trash2, Plus, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useLayoutPresets, LayoutPreset } from "@/hooks/useLayoutPresets";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditLayoutModalProps {
  tables: Table[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { id: string; seats: number }[]) => void;
  onCombineTables: (tableIds: string[]) => void;
  onUncombineTable: (tableId: string) => void;
  onShapeChange: (tableId: string, shape: 'round' | 'square') => void;
  onStartMoveTables: () => void;
  onLoadPreset: (tables: Table[]) => void;
}

export function EditLayoutModal({
  tables,
  isOpen,
  onClose,
  onSave,
  onCombineTables,
  onUncombineTable,
  onShapeChange,
  onStartMoveTables,
  onLoadPreset,
}: EditLayoutModalProps) {
  const { t } = useLanguage();
  const [seatUpdates, setSeatUpdates] = useState<Record<string, number>>({});
  const [selectedForCombine, setSelectedForCombine] = useState<string[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editPresetName, setEditPresetName] = useState("");
  
  const { presets, addPreset, deletePreset, updatePresetName } = useLayoutPresets();

  const handleSeatChange = (tableId: string, seats: number) => {
    setSeatUpdates((prev) => ({
      ...prev,
      [tableId]: seats,
    }));
  };

  const handleSave = () => {
    const updates = Object.entries(seatUpdates).map(([id, seats]) => ({
      id,
      seats,
    }));
    
    if (updates.length > 0) {
      onSave(updates);
      toast.success(t("updated", { count: updates.length }));
    }
    
    setSeatUpdates({});
    onClose();
  };

  const handleClose = () => {
    setSeatUpdates({});
    setSelectedForCombine([]);
    setNewPresetName("");
    setEditingPresetId(null);
    onClose();
  };

  const getSeats = (table: Table) => {
    return seatUpdates[table.id] ?? table.seats;
  };

  const toggleTableSelection = (tableId: string) => {
    setSelectedForCombine((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleCombine = () => {
    if (selectedForCombine.length < 2) {
      toast.error(t("selectAtLeast2"));
      return;
    }
    onCombineTables(selectedForCombine);
    setSelectedForCombine([]);
    toast.success(t("tablesCombined"));
  };

  const handleUncombine = (tableId: string) => {
    onUncombineTable(tableId);
    toast.success(t("tableUncombined"));
  };

  const isTableCombined = (table: Table) => {
    return table.combinedWith && table.combinedWith.length > 0;
  };

  const canSelectForCombine = (table: Table) => {
    return !isTableCombined(table);
  };

  const handleMoveTables = () => {
    onClose();
    onStartMoveTables();
  };

  const handleShapeToggle = (table: Table) => {
    const newShape = table.shape === 'round' ? 'square' : 'round';
    onShapeChange(table.id, newShape);
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      toast.error(t("enterPresetName"));
      return;
    }
    addPreset(newPresetName.trim(), tables);
    setNewPresetName("");
    toast.success(t("presetSaved"));
  };

  const handleLoadPreset = (preset: LayoutPreset) => {
    onLoadPreset(preset.tables);
    toast.success(t("presetLoaded"));
    handleClose();
  };

  const handleDeletePreset = (presetId: string) => {
    deletePreset(presetId);
    toast.success(t("presetDeleted"));
  };

  const handleStartEditPreset = (preset: LayoutPreset) => {
    setEditingPresetId(preset.id);
    setEditPresetName(preset.name);
  };

  const handleSavePresetName = () => {
    if (editingPresetId && editPresetName.trim()) {
      updatePresetName(editingPresetId, editPresetName.trim());
      setEditingPresetId(null);
      setEditPresetName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t("editTableLayout")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("adjustSeats")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Move Tables Button */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleMoveTables}
          >
            <Move className="w-4 h-4" />
            {t("moveTables")}
          </Button>

          {/* Combine Tables Section */}
          <div className="bg-secondary/30 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("combineTables")}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCombine}
                disabled={selectedForCombine.length < 2}
                className="gap-1"
              >
                <Link2 className="w-3 h-3" />
                {t("combine")} ({selectedForCombine.length})
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("selectTables")}
            </p>
          </div>

          <ScrollArea className="max-h-[200px] pr-4">
            <div className="space-y-3">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {canSelectForCombine(table) && (
                      <Checkbox
                        checked={selectedForCombine.includes(table.id)}
                        onCheckedChange={() => toggleTableSelection(table.id)}
                      />
                    )}
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded-lg text-sm font-semibold min-w-[50px] text-center">
                      {table.displayName || table.number}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleShapeToggle(table)}
                      className="h-7 w-7 p-0"
                      title={`Change to ${table.shape === 'round' ? 'square' : 'round'}`}
                    >
                      {table.shape === 'round' ? (
                        <Circle className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </Button>
                    {isTableCombined(table) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUncombine(table.id)}
                        className="h-6 px-2 text-xs gap-1 text-destructive hover:text-destructive"
                      >
                        <Unlink className="w-3 h-3" />
                        {t("split")}
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`seats-${table.id}`} className="text-sm text-muted-foreground">
                      {t("seats")}:
                    </Label>
                    <Input
                      id={`seats-${table.id}`}
                      type="number"
                      min={1}
                      max={20}
                      value={getSeats(table)}
                      onChange={(e) =>
                        handleSeatChange(table.id, parseInt(e.target.value) || 1)
                      }
                      className="w-16 bg-background text-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          {/* Layout Presets Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t("layoutPresets")}</span>
            </div>

            {/* Save new preset */}
            <div className="flex gap-2">
              <Input
                placeholder={t("presetName")}
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="flex-1 bg-background"
              />
              <Button size="sm" variant="outline" onClick={handleSavePreset} className="gap-1">
                <Plus className="w-3 h-3" />
                {t("saveAsPreset")}
              </Button>
            </div>

            {/* Preset list */}
            {presets.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">{t("noPresets")}</p>
            ) : (
              <div className="space-y-2 max-h-[120px] overflow-y-auto">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between bg-secondary/30 p-2 rounded-lg"
                  >
                    {editingPresetId === preset.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editPresetName}
                          onChange={(e) => setEditPresetName(e.target.value)}
                          className="h-7 text-sm flex-1"
                          onKeyDown={(e) => e.key === "Enter" && handleSavePresetName()}
                        />
                        <Button size="sm" variant="ghost" onClick={handleSavePresetName} className="h-7 px-2">
                          <Save className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium">{preset.name}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleLoadPreset(preset)}
                            className="h-7 px-2 text-xs"
                          >
                            {t("loadPreset")}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEditPreset(preset)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeletePreset(preset.id)}
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {t("saveChanges")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
