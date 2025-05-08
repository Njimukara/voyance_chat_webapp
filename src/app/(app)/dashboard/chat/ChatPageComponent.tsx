"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSidebar } from "./ChatSidebar";
import { ChatHeader } from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { SeerClientForm } from "./SeerClientForm";
import { Message, UserDTO, UserType } from "@/types/general";
import ApiClient from "../../../../utils/axiosbase";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { formatDateForAPI, getUserRole } from "@/utils/apiConfig";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import ConfirmPurchaseCreditModal from "@/components/ui/ConfirmPurchaseCreditModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSeer } from "@/lib/SeerContext";

interface ChatInterfaceProps {
  id?: string;
}
const ChatPageComponent: React.FC<ChatInterfaceProps> = ({ id }) => {
  const seerId = id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newMessageTrigger, setNewMessageTrigger] = useState(0);
  const [localSentMessage, setLocalSentMessage] = useState<Message | null>(
    null
  );

  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [clientList, setClientList] = useState<UserDTO[]>([]);
  const [creditsLeft, setCreditsLeft] = useState(0);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const userType: UserType = getUserRole(
    session?.user?.user_profile?.user_type
  );

  const userId: number | undefined = session?.user?.id;
  const { toast } = useToast();
  const { selectedSeer } = useSeer();

  const sendMessageEndpoint = (id: number | undefined | null) => {
    return userType === "SEER"
      ? "/api/chat/seer/send-message/"
      : `/api/chat/user/${id}/send-message/`;
  };
  const isSeer = userType === "SEER";
  useEffect(() => {
    if (window.performance) {
      if (performance.navigation.type == 1) {
        const pathParts = window.location.pathname.split("/");

        if (seerId != null) {
          const newUrl = pathParts.slice(0, -1).join("/");
          window.history.replaceState({}, document.title, newUrl);
        }
      }
    }
    fetchUpdatedUserDetails();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await ApiClient.get(
        `/api/chat/seer/customers?seer_id=${selectedSeer?.id || userId}`
      );
      if (response.status === 200) {
        return response.data?.results;
      } else {
        throw new Error("Échec de la récupération des utilisateurs");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
          "Une erreur est survenue lors de la récupération des voyants"
      );
    }
  };

  const fetchAllSeers = async () => {
    try {
      const response = await ApiClient.get("/api/seers/");
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

  const { data: allSeers, isLoading: seersLoading } = useQuery({
    queryKey: ["allSeers"],
    queryFn: fetchAllSeers,
    enabled: !!seerId, // Only fetch if there's a seerId
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && !error.response) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const {
    data: clients,
    isLoading: clientsLoading,
    error,
  } = useQuery({
    queryKey: ["clients", selectedSeer?.id],
    queryFn: fetchClients,
    enabled: userType === "SEER" || userType == "CLIENT",
    staleTime: 3 * 60 * 1000,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && !error.response) {
        return false;
      }
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (clients) {
      let updatedClients = [...clients];

      if (seerId) {
        const seerIdInt = parseInt(seerId);
        const existingClient = clients?.find(
          (c: UserDTO) => c.id === seerIdInt
        );
        const newSeer = allSeers?.find(
          (s: UserDTO) => parseInt(s.user) === seerIdInt
        );

        const selectedSeer = existingClient || newSeer;
        setIsNewClient(!existingClient && !!newSeer);
        setSelectedUser(selectedSeer);
        if (
          selectedSeer &&
          !updatedClients.some((c) => c.id === selectedSeer.id)
        ) {
          updatedClients.push(selectedSeer);
        }
      }
      setClientList(updatedClients);
      setIsNewClient(false);
    }
  }, [seerId, clients, allSeers]);

  const handleSendMessage = async () => {
    if (userType === "CLIENT" && creditsLeft < 1) {
      setShowModal(true);
      return;
    }

    if (!selectedUser) {
      toast({
        title: "Erreur Inattendue",
        description:
          "Aucun utilisateur sélectionné. Veuillez sélectionner un utilisateur avant d’envoyer le message.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const storedSeeker = localStorage.getItem("selectedSeeker");
      let initialSenderId = 0;

      if (storedSeeker) {
        try {
          const parsedSeeker = JSON.parse(storedSeeker);
          initialSenderId = parsedSeeker?.id || 0;
        } catch (error) {
          console.error("Failed to parse stored seeker", error);
        }
      }

      const receiverId = seerId ? parseInt(seerId, 10) : selectedUser.id;

      const payload =
        userType === "SEER"
          ? {
              body: inputMessage,
              receiver: receiverId,
              initialSender: initialSenderId,
              sender: userId,
            }
          : { body: inputMessage, sender: userId };

      const tempMessage = {
        id: Date.now(),
        sender: userId!,
        body: inputMessage,
        creation_date: new Date().toISOString(),
      };

      setLocalSentMessage(tempMessage);

      const response = await ApiClient.post(
        sendMessageEndpoint(receiverId),
        payload
      );
      if (
        !response.status.toString().startsWith("2") &&
        !response.status.toString().startsWith("3")
      ) {
        toast({
          title: "Erreur Inattendue",
          description: "Échec de l'envoi du message",
          variant: "destructive",
        });
      }
      setNewMessageTrigger((prev) => prev + 1);
      setInputMessage("");
      await fetchUpdatedUserDetails();
    } catch (error) {
      toast({
        title: "Erreur Inattendue",
        description: "Erreur lors de l'envoi du message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdatedUserDetails = async () => {
    try {
      const response = await ApiClient.get("/auth/users/me/");
      if (response.status === 200) {
        setCreditsLeft(response.data.creditBalance);
      }
    } catch (error) {}
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev); // Toggle sidebar visibility
  };

  const [showSeerFormFloating, setShowSeerFormFloating] = useState(false);

  const isMobile = useIsMobile();

  return (
    <div className="flex h-full w-full relative">
      {!isMobile && (
        <ChatSidebar
          users={clientList || []}
          selectedUser={selectedUser}
          onSelectUser={(user) => {
            setSelectedUser(user);
            setSidebarOpen(false);
          }}
          isLoading={clientsLoading}
          error={error}
          isOpen={sidebarOpen}
        />
      )}

      {isMobile && !selectedUser && (
        <ChatSidebar
          users={clientList || []}
          selectedUser={selectedUser}
          onSelectUser={(user) => {
            setSelectedUser(user);
            setSidebarOpen(false);
          }}
          isLoading={clientsLoading}
          error={error}
          isOpen={sidebarOpen}
        />
      )}

      <div className="flex flex-1 overflow-hidden md:flex-row">
        <Card className="flex flex-1 flex-col overflow-hidden rounded-none border-0 md:border">
          <ChatHeader
            userType={userType}
            selectedUser={selectedUser}
            creditsLeft={creditsLeft}
            onBack={() => setSelectedUser(null)}
            onToggleSidebar={toggleSidebar}
            isMobile={isMobile} // Mobile detection state
            setShowSeerFormFloating={setShowSeerFormFloating}
          />

          {selectedUser && (
            <>
              <ChatMessages
                userId={userId}
                userType={userType}
                selectedUser={selectedUser}
                newMessageTrigger={newMessageTrigger}
                localSentMessage={localSentMessage}
                isNewClient={isNewClient}
              />

              <ChatInput
                onSendMessage={handleSendMessage}
                newMessage={inputMessage}
                setNewMessage={setInputMessage}
                loading={loading}
              />
            </>
          )}
        </Card>

        {/* todo */}
        {/* implement a toggle for the SeerClientForm and on mobile, the chatsidebar and the seerclientform should not be both open at the same time */}
        {isSeer && selectedUser && (
          <div
            className={
              "hidden md:flex md:flex-col md:w-80 md:border-l md:bg-card "
            }
          >
            <SeerClientForm client={selectedUser} />
          </div>
        )}

        {isMobile && isSeer && selectedUser && (
          <>
            {/* Floating Form */}
            {showSeerFormFloating && (
              <div className="fixed bottom-20 right-4 z-50 w-80 bg-card rounded-2xl shadow-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div></div>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowSeerFormFloating(false)}
                  >
                    ✕
                  </button>
                </div>
                <SeerClientForm client={selectedUser} />
              </div>
            )}
          </>
        )}

        <ConfirmPurchaseCreditModal
          open={showModal}
          message="Vous n'avez pas assez de crédits pour envoyer un message. Souhaitez-vous acheter plus de crédits ?"
          onClose={() => setShowModal(false)}
          onConfirm={() => router.push("/credits")}
        />
      </div>
    </div>
  );
};

export default ChatPageComponent;
