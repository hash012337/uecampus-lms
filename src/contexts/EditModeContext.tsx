import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (value: boolean) => void;
  isAdmin: boolean;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { isAdmin } = useAuth();

  // Auto-disable edit mode if user loses admin status
  useEffect(() => {
    if (!isAdmin && isEditMode) {
      setIsEditMode(false);
    }
  }, [isAdmin, isEditMode]);

  const toggleEditMode = () => {
    if (isAdmin) {
      setIsEditMode(prev => !prev);
    }
  };

  const setEditMode = (value: boolean) => {
    if (isAdmin) {
      setIsEditMode(value);
    }
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode, setEditMode, isAdmin }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return context;
}
