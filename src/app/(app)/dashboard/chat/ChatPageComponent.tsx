"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChatSidebar } from "./ChatSidebar";
import { ChatHeader } from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { SeerClientForm } from "./SeerClientForm";
import { Message, UserDTO, UserType } from "@/types/general";
import ApiClient from "../../../../utils/axiosbase";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserRole } from "@/utils/apiConfig";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import ConfirmPurchaseCreditModal from "@/components/ui/ConfirmPurchaseCreditModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSeer } from "@/lib/SeerContext";
import { useUser } from "@/lib/UserContext";
import { Button } from "@/components/ui/button";

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
  const [showSeerFormFloating, setShowSeerFormFloating] = useState(false);
  const [showSeerFormDesktop, setShowSeerFormDesktop] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [clientList, setClientList] = useState<UserDTO[]>([]);
  const [creditsLeft, setCreditsLeft] = useState(0);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);
  const [isFromSeerList, setIsFromSeerList] = useState(false);
  const { updateCreditBalance } = useUser();

  const router = useRouter();
  const { data: session } = useSession();
  const userType: UserType = getUserRole(
    session?.user?.user_profile?.user_type
  );
  const userId: number | undefined = session?.user?.id;
  const { toast } = useToast();
  const { selectedSeer } = useSeer();

  const isSeer = userType === "SEER";
  const isMobile = useIsMobile();

  useEffect(() => {
    if (
      window.performance &&
      performance.navigation.type == 1 &&
      seerId != null
    ) {
      const pathParts = window.location.pathname.split("/");
      const newUrl = pathParts.slice(0, -1).join("/");
      window.history.replaceState({}, document.title, newUrl);
    }
    fetchUpdatedUserDetails();
  }, []);

  const fetchClients = async () => {
    try {
      const url =
        userType === "SEER"
          ? "/api/chat/seer/all-unanswered-users"
          : `/api/chat/seer/customers?seer_id=${selectedSeer?.user || userId}`;

      const response = await ApiClient.get(url);
      return response.status === 200
        ? response.data?.results
        : Promise.reject("Échec de la récupération des utilisateurs");
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
      return response.status === 200
        ? response.data?.results
        : Promise.reject("Échec de la récupération des voyants");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
          "Une erreur est survenue lors de la récupération des voyants"
      );
    }
  };

  const { data: allSeers } = useQuery({
    queryKey: ["allSeers"],
    queryFn: fetchAllSeers,
    enabled: !!seerId,
    staleTime: 60000,
    retry: (failureCount, error) =>
      axios.isAxiosError(error) && !error.response ? false : failureCount < 2,
  });

  const {
    data: clients,
    isLoading: clientsLoading,
    error,
  } = useQuery({
    queryKey: ["clients", selectedSeer?.id],
    queryFn: fetchClients,
    enabled: userType === "SEER" || userType == "CLIENT",
    staleTime: 60000,
    refetchInterval: 20000,
    retry: (failureCount, error) =>
      axios.isAxiosError(error) && !error.response ? false : failureCount < 2,
  });

  useEffect(() => {
    if (!clients) return;

    let updatedClients = [...clients];
    const seerIdInt = seerId ? parseInt(seerId) : null;
    const existingClient = clients.find((c: UserDTO) => c.id === seerIdInt);
    const newSeer = allSeers?.find(
      (s: UserDTO) => parseInt(s.user) === seerIdInt
    );
    const selected = existingClient || newSeer;

    setIsNewClient(!existingClient && !!newSeer);
    // if (!selectedUser || selected?.id !== selectedUser.id) {
    //   setSelectedUser(selected);
    // }

    setIsFromSeerList(!!newSeer && !existingClient);

    if (selected && !updatedClients.some((c) => c.id === selected.id)) {
      updatedClients.push(selected);
    }
    setClientList(updatedClients);
    setIsNewClient(false);
  }, [seerId, clients, allSeers]);

  const sendMessageEndpoint = (id: number | undefined | null) => {
    return userType === "SEER"
      ? "/api/chat/seer/send-message/"
      : `/api/chat/user/${id}/send-message/`;
  };

  const handleSendMessage = async () => {
    if (userType === "CLIENT" && creditsLeft < 1) return setShowModal(true);
    if (!userId || !selectedUser) {
      toast({
        title: "Erreur Inattendue",
        description: !userId
          ? "Aucun identifiant utilisateur détecté. Veuillez vous reconnecter."
          : "Aucun utilisateur sélectionné. Veuillez en sélectionner un.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const seerUserId = Number(selectedSeer?.id);
      const actualSender = !isNaN(seerUserId) ? seerUserId : userId!;
      const initialSenderId = selectedSeer?.id || 0;

      const payload =
        userType === "SEER"
          ? {
              body: inputMessage,
              receiver: selectedUser.id,
              initialSender: initialSenderId,
              sender: actualSender,
            }
          : { body: inputMessage, sender: userId };

      setLocalSentMessage({
        id: `temp-${Date.now()}`,
        sender: actualSender,
        body: inputMessage,
        creation_date: new Date().toISOString(),
        isTemporary: true,
      });

      const senderId =
        isFromSeerList && seerId ? Number(seerId) : selectedUser.id;
      await ApiClient.post(sendMessageEndpoint(senderId), payload);
      setNewMessageTrigger((prev) => prev + 1);
      setInputMessage("");
      fetchUpdatedUserDetails();
    } catch {
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
        updateCreditBalance(response.data.creditBalance);
      }
    } catch {}
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-full w-full relative">
      {!isMobile && (
        <ChatSidebar
          users={clientList}
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
          users={clientList}
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
          <div className="flex items-center justify-between p-2 border-b">
            <ChatHeader
              userType={userType}
              selectedUser={selectedUser}
              creditsLeft={creditsLeft}
              onBack={() => setSelectedUser(null)}
              onToggleSidebar={toggleSidebar}
              isMobile={isMobile}
              setShowSeerFormFloating={setShowSeerFormFloating}
            />
          </div>

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
                userType={userType}
                selectedUser={selectedUser}
              />
            </>
          )}
        </Card>

        {isSeer && selectedUser && showSeerFormDesktop && (
          <div className="hidden md:flex md:flex-col md:w-80 md:border-l md:bg-card">
            <SeerClientForm client={selectedUser} />
          </div>
        )}

        {isMobile && isSeer && selectedUser && showSeerFormFloating && (
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
