import { useState, useMemo, useEffect } from "react"; // ✨ Add useState and useMemo
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { formatLastAction, UserDTO } from "@/types/general";

interface ChatSidebarProps {
  users: UserDTO[];
  selectedUser: UserDTO | null;
  onSelectUser: (user: UserDTO) => void;
  isLoading: boolean;
  error: Error | null;
  isOpen: boolean;
}

export function ChatSidebar({
  users,
  selectedUser,
  onSelectUser,
  isLoading,
  error,
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="w-full md:w-72 lg:w-72 border-r h-full flex flex-col">
      {/* Search Field */}
      <div className="p-4">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un utilisateur..."
        />
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-500">
            Erreur lors du chargement des utilisateurs.
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition hover:bg-muted ${
                    selectedUser?.id === user.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatar || ""}
                        alt={user.name || ""}
                      />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {/* Online Indicator */}
                    {user.status === "active" && (
                      <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
                    )}
                    {user.status === "inactive" && (
                      <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-gray-400 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="text-sm font-medium capitalize">
                      {user.name}
                    </div>

                    {/* Status Text */}
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {user.status === "online"
                        ? "En ligne"
                        : user.last_action
                        ? `Vu il y a ${formatLastAction(user.last_action)}`
                        : "Hors ligne"}
                    </div>

                    {/* Last Message */}
                    {user.last_message && (
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {user.last_message}
                      </div>
                    )}
                  </div>
                  {/* Unread Messages */}
                  {user &&
                    user.unread_message_count != null &&
                    user.unread_message_count > 0 && (
                      <div className="text-xs text-white font-medium bg-primary rounded-full px-2 py-1">
                        {user.unread_message_count}
                      </div>
                    )}
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground py-6">
                Aucun utilisateur trouvé
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
