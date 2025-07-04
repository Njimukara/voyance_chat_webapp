import { AppUser, UserDTO } from "@/types/general";
import { createContext, useContext, useState } from "react";

interface UserContextType {
  contextUser: AppUser | null;
  updateCreditBalance: (newBalance: number) => void;

  selectedChatUser: UserDTO | null;
  setSelectedChatUser: (user: UserDTO | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AppUser | null;
}) {
  const [contextUser, setContextUser] = useState<AppUser | null>(initialUser);
  const [selectedChatUser, setSelectedChatUser] = useState<UserDTO | null>(
    null
  );

  const updateCreditBalance = (newBalance: number) => {
    if (contextUser) {
      setContextUser({ ...contextUser, creditBalance: newBalance });
    }
  };

  return (
    <UserContext.Provider
      value={{
        contextUser,
        updateCreditBalance,
        selectedChatUser,
        setSelectedChatUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
