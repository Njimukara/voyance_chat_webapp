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
import { Settings, LogOut, User as UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import ApiClient from "@/utils/axiosbase";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserDTO } from "@/types/general";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";
import { useSeer } from "@/lib/SeerContext";

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

const fetchAllSeers = async () => {
  try {
    const response = await ApiClient.get("/api/seers");
    if (response.status === 200) {
      return response.data?.results;
    } else {
      throw new Error("Échec de la récupération des voyants");
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail ||
        "Une erreur est survenue lors de la récupération des voyants"
    );
  }
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedSeer, setSelectedSeer } = useSeer();
  const [pendingSeeker, setPendingSeeker] = useState<UserDTO | null>(null);
  const { data: session } = useSession();
  const userId: number | undefined = session?.user?.id;

  const handleSeekerClick = (seeker: UserDTO) => {
    setPendingSeeker(seeker);
    setIsModalOpen(true);
  };

  const handleConfirmSwitch = () => {
    if (pendingSeeker) {
      if (pendingSeeker) {
        setSelectedSeer(pendingSeeker);
      }
    }
    setPendingSeeker(null);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("selectedSeer");
    signOut({ callbackUrl: "/login" });
  };

  const {
    data: seers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["seers"],
    queryFn: fetchAllSeers,
    staleTime: 3 * 60 * 1000,
    refetchInterval: 4 * 60 * 1000,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && !error.response) {
        return false;
      }
      return failureCount < 2;
    },
  });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      {user?.isAdmin && seers.length > 0 && (
        <div className="flex items-center gap-2 ml-auto">
          {isLoading ? (
            <div className="w-5 h-5 border-4 border-t-4 border-primary rounded-full animate-spin"></div>
          ) : (
            seers?.length > 0 &&
            seers
              .filter((seer: UserDTO) => seer.id !== userId)
              .map((seer: UserDTO) => (
                <button
                  key={seer.id}
                  className={cn(
                    "px-4 capitalize py-2 text-sm font-medium rounded-full border-2 transition-colors",
                    selectedSeer?.id === seer.id
                      ? "bg-primary text-white border-primary"
                      : "text-muted-foreground bg-background hover:bg-primary hover:text-white"
                  )}
                  onClick={() => handleSeekerClick(seer)}
                >
                  {seer.name}
                </button>
              ))
          )}
        </div>
      )}
      <div className="flex-1" />
      <div className="flex items-center gap-4 flex-grow-0">
        <div className="flex flex-col">
          <p className="text-sm font-medium">{user?.name ?? "Utilisateur"}</p>

          {user?.isClient && user?.creditBalance !== undefined && (
            <p className="text-xs text-muted-foreground">
              {user?.creditBalance} crédits
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
        onConfirm={() => {
          handleConfirmSwitch();
        }}
        onClose={() => {
          setPendingSeeker(null);
          setIsModalOpen(false);
        }}
        open={isModalOpen}
      />
    </header>
  );
}
