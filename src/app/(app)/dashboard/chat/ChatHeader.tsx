import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserDTO, UserType } from "@/types/general";
import { ArrowLeft, Coins } from "lucide-react";

interface ChatHeaderProps {
  selectedUser: UserDTO | null;
  userType: UserType | null;
  creditsLeft: number;
  onBack: () => void;
  onToggleSidebar: () => void;
  isMobile: boolean; // Added mobile detection prop
  setShowSeerFormFloating: React.Dispatch<React.SetStateAction<boolean>>; // Handle floating form state
}

export function ChatHeader({
  selectedUser,
  userType,
  creditsLeft,
  onBack,
  onToggleSidebar,
  isMobile,
  setShowSeerFormFloating,
}: ChatHeaderProps) {
  if (!selectedUser) return null; // No user selected, no header needed

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      {/* Left side: Back button + user info */}
      <div className="flex items-center gap-2">
        {/* Mobile back button */}
        {selectedUser ? (
          <button onClick={onBack} className="text-blue-500">
            <ArrowLeft />
          </button>
        ) : (
          <button onClick={onToggleSidebar} className="text-blue-500">
            {selectedUser ? "Back" : "Toggle Sidebar"}
          </button>
        )}

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
              className={`
                text-xs 
                ${selectedUser.status === "online" ? "text-green-500" : ""}
                ${selectedUser.status === "inactive" ? "text-gray-500" : ""}
                text-muted-foreground
              `}
            >
              {selectedUser.status}
            </div>
          </div>

          {/* Info button (appears only on mobile) */}
          {isMobile && userType === "SEER" && selectedUser && (
            <button
              onClick={() => setShowSeerFormFloating(true)}
              className="text-primary hover:text-primary/80 ml-2"
            >
              ℹ️
            </button>
          )}
        </div>
      </div>

      {userType === "CLIENT" && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Coins className="h-4 w-4 text-primary" />
          <span>{creditsLeft} Crédits</span>
        </div>
      )}
    </header>
  );
}
