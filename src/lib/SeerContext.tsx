import { createContext, useContext, useState, useEffect } from "react";
import { UserDTO } from "@/types/general";

type SeerContextType = {
  selectedSeer: UserDTO | null;
  setSelectedSeer: (seer: UserDTO) => void;
};

const SeerContext = createContext<SeerContextType | undefined>(undefined);

export const SeerProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedSeer, setSelectedSeer] = useState<UserDTO | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedSeer");
    if (stored) {
      try {
        setSelectedSeer(JSON.parse(stored));
      } catch (err) {
        console.error("Error loading selectedSeer from localStorage", err);
      }
    }
  }, []);

  const updateSeer = (seer: UserDTO) => {
    localStorage.setItem("selectedSeer", JSON.stringify(seer));
    setSelectedSeer(seer);
  };

  return (
    <SeerContext.Provider value={{ selectedSeer, setSelectedSeer: updateSeer }}>
      {children}
    </SeerContext.Provider>
  );
};

export const useSeer = () => {
  const context = useContext(SeerContext);
  if (!context) throw new Error("useSeer must be used within SeerProvider");
  return context;
};
