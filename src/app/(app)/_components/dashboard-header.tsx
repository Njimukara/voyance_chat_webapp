"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import ApiClient from "@/utils/axiosbase";
import { useEffect, useState } from "react";
import { UserDTO, UserType } from "@/types/general";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";
import { useSeer } from "@/lib/SeerContext";
import { useUser } from "@/lib/UserContext";
import { getUserRole } from "@/utils/apiConfig";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    creditBalance?: number;
    isClient?: boolean;
    isAdmin?: boolean;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [seers, setSeers] = useState<UserDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { selectedSeer, setSelectedSeer } = useSeer();
  const [pendingSeeker, setPendingSeeker] = useState<UserDTO | null>(null);
  const { contextUser, selectedChatUser } = useUser();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userType: UserType = getUserRole(contextUser?.user_profile?.user_type);

  const handleSeekerClick = (seeker: UserDTO) => {
    setPendingSeeker(seeker);
    setIsModalOpen(true);
  };

  const handleConfirmSwitch = () => {
    if (pendingSeeker) setSelectedSeer(pendingSeeker);
    setPendingSeeker(null);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    document.body.classList.add("fade-out");

    setTimeout(() => {
      localStorage.removeItem("selectedSeer");
      signOut({ callbackUrl: "/login" });
    }, 300); // match animation duration
  };

  useEffect(() => {
    if (!selectedChatUser) return;

    const fetchClientDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await ApiClient.get(
          "/api/chat/seer/unresponsive-seers",
          {
            params: { customer_id: selectedChatUser.id },
          }
        );
        setSeers(response.data.results || []);
      } catch (err) {
        setError("Impossible de charger les voyants. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientDetails();
  }, [selectedChatUser]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />

      {user?.isAdmin && (
        <div className="flex items-center gap-2 ml-auto">
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            seers
              .filter((seer) => seer.id !== userId)
              .map((seer) => (
                <button
                  key={seer.id}
                  className={cn(
                    "opacity-0 animate-fadeInSlow relative px-4 capitalize py-2 text-sm font-medium rounded-full border-2 transition-all duration-300",
                    selectedSeer?.id === seer.id
                      ? "bg-primary text-white border-primary"
                      : "text-muted-foreground bg-background hover:bg-primary hover:text-white"
                  )}
                  onClick={() => handleSeekerClick(seer)}
                >
                  {seer.name}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                    +1
                  </span>
                </button>
              ))
          )}
        </div>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-4 flex-grow-0">
        <div className="flex flex-col">
          <p className="text-sm font-medium">
            {contextUser?.name ?? "Utilisateur"}
          </p>
          {userType === "CLIENT" &&
            contextUser?.creditBalance !== undefined && (
              <p className="text-xs text-muted-foreground">
                {contextUser.creditBalance} crédits
              </p>
            )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full p-0"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name ?? "Utilisateur"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email ?? "Pas d'email"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handleLogout();
              }}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmModal
        message={`Êtes-vous sûr de vouloir passer à ${pendingSeeker?.name} ?`}
        onConfirm={handleConfirmSwitch}
        onClose={() => {
          setPendingSeeker(null);
          setIsModalOpen(false);
        }}
        open={isModalOpen}
      />
    </header>
  );
}
