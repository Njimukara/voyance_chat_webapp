import { useState, useMemo, useEffect, useRef, useCallback } from "react"; // ✨ Add useState and useMemo
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { formatLastAction, UserDTO } from "@/types/general";
import { useUser } from "@/lib/UserContext";
import { useSeer } from "@/lib/SeerContext";

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
  const hasSelectedFirstUser = useRef(false);
  const { setSelectedChatUser } = useUser();
  const { selectedSeer } = useSeer();

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleUserSelection = useCallback(
    (user: any) => {
      // console.log("User selected in layout:", user);
      onSelectUser(user);
      setSelectedChatUser(user);
    },
    [onSelectUser]
  );

  useEffect(() => {
    if (
      filteredUsers.length > 0 &&
      !selectedUser &&
      !hasSelectedFirstUser.current
    ) {
      handleUserSelection(filteredUsers[0]);
      hasSelectedFirstUser.current = true;
    }
  }, [filteredUsers, selectedUser]);

  // useEffect(() => {
  //   if (selectedSeer && filteredUsers.length > 0) {
  //     setTimeout(() => {
  //       handleUserSelection(filteredUsers[0]);
  //       hasSelectedFirstUser.current = true;
  //     }, 0);
  //   }
  // }, [selectedSeer, filteredUsers]);

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
                  onClick={() => handleUserSelection(user)}
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
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {user.status === "active"
                        ? ""
                        : user.last_action
                        ? `Vu il y a ${formatLastAction(user.last_action)}`
                        : "Hors ligne"}
                    </div>

                    {/* Last Message */}
                    {user.last_message && (
                      <div className="text-xs text-muted-foreground truncate max-w-[250px] md:max-w-[180px] lg:max-w-[180px]">
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
