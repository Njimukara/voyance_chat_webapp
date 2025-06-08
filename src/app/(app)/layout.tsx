"use client";

import type { ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MessageSquare,
  Users,
  ShoppingCart,
  LogOut,
  User as UserIcon,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";
import { DashboardHeader } from "./_components/dashboard-header";
import { SignOutButton } from "@/components/auth/signout-button"; // Import SignOutButton
import { auth } from "@/lib/auth";
import { AppUser, UserType } from "@/types/general";
import { getUserRole } from "@/utils/apiConfig";
import { UserProvider } from "@/lib/UserContext";
import { useSession } from "next-auth/react";

// Define AppUser type matching NextAuth config

export default function AppLayout({ children }: { children: ReactNode }) {
  // const session = await auth();
  const { data: session } = useSession();
  const user = session?.user as AppUser | undefined;
  const userType: UserType = getUserRole(
    session?.user?.user_profile?.user_type
  );

  if (!user) {
    // This should ideally not be reached if middleware is set up correctly
    // You could redirect here as a fallback, but middleware is preferred
    // redirect('/login');
    return null; // Or return a loading state/message
  }

  return (
    <UserProvider initialUser={user}>
      <SidebarProvider>
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader className="items-center justify-center gap-0 p-0 group-data-[collapsible=icon]:justify-start group-data-[collapsible=icon]:p-2">
            {/* Placeholder Logo */}
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 p-2 group-data-[collapsible=icon]:hidden"
            >
              <img
                src="/images/logo/logo.png"
                alt="Voyance Icon"
                className="w-6 h-6"
              />
              <span className="font-semibold text-lg">Voyance Chat</span>
            </Link>
            {/* Icon only logo */}
            <Link
              href="/dashboard"
              className="hidden items-center justify-center p-2 group-data-[collapsible=icon]:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-primary"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Voyance Chat</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="pl-4 pt-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Chat">
                  <Link href="/dashboard/chat">
                    <MessageSquare />
                    <span>Chat Temps Réel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {userType === "CLIENT" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Profils Voyants">
                      <Link href="/dashboard/seers">
                        <Users />
                        <span>Profils Voyants</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Acheter Crédits">
                      <Link href="/dashboard/purchase-credits">
                        <CreditCard />
                        <span>Acheter Crédits</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Profil">
                  <Link href="/dashboard/profile">
                    <UserIcon />
                    <span>Profil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="flex flex-col items-center gap-2 p-2">
            <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:hidden">
              <Avatar className="h-8 w-8">
                {/* Use user.image from session */}
                <AvatarImage
                  src={user?.user_profile?.avatar ?? undefined}
                  alt={user.name ?? ""}
                />
                <AvatarFallback>
                  {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-medium">
                  {user.name ?? "Utilisateur"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.email ?? "Pas d'email"}
                </span>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SignOutButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col min-h-screen overflow-hidden">
          {/* Pass user data from session to DashboardHeader */}
          <DashboardHeader
            user={{
              name: user.name,
              email: user.email,
              avatar: user.user_profile?.avatar,
              creditBalance: user.creditBalance,
              isClient: userType === "CLIENT",
              isAdmin: userType === "SEER",
            }}
          />
          <main
            className="overflow-y-auto overflow-x-hidden"
            style={{ height: "calc(100vh - 56px)" }}
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
