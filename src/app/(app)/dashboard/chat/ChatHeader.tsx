import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserDTO, UserType } from "@/types/general";
import { ArrowLeft, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  selectedUser: UserDTO | null;
  userType: UserType | null;
  creditsLeft: number;
  onBack: () => void;
  onToggleSidebar: () => void;
  isMobile: boolean;
  setShowSeerFormFloating: React.Dispatch<React.SetStateAction<boolean>>;

  // Optional desktop form control props
  showSeerFormDesktop?: boolean;
  setShowSeerFormDesktop?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ChatHeader({
  selectedUser,
  userType,
  creditsLeft,
  onBack,
  isMobile,
  setShowSeerFormFloating,
}: ChatHeaderProps) {
  const isSeer = userType === "SEER";

  if (!selectedUser) return null;

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      {/* Left: Back or sidebar toggle + user info */}
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="text-blue-500">
          <ArrowLeft />
        </button>

        <Avatar>
          <AvatarImage
            src={selectedUser.avatar || ""}
            alt={selectedUser.name || ""}
          />
          <AvatarFallback>{selectedUser.name?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-medium capitalize">
              {selectedUser.name}
            </div>
            <div
              className={`text-xs text-muted-foreground ${
                selectedUser.status === "online"
                  ? "text-green-500"
                  : selectedUser.status === "inactive"
                  ? "text-gray-500"
                  : ""
              }`}
            >
              {selectedUser.status}
            </div>
          </div>

          {/* Mobile floating form button */}
          {isMobile && isSeer && (
            <button
              onClick={() => setShowSeerFormFloating(true)}
              className="text-primary hover:text-primary/80 ml-2"
            >
              ℹ️
            </button>
          )}
        </div>
      </div>

      {/* Credits for client */}
      {userType === "CLIENT" && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Coins className="h-4 w-4 text-primary" />
          <span>{creditsLeft} Crédits</span>
        </div>
      )}
    </header>
  );
}
