import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Message, UserDTO, UserType } from "@/types/general";
import { useEffect, useRef, useState } from "react";
import ApiClient from "@/utils/axiosbase";
import { formatDateForAPI } from "@/utils/apiConfig";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { useSeer } from "@/lib/SeerContext";

interface ChatMessagesProps {
  selectedUser: UserDTO | null;
  userId: number | undefined;
  newMessageTrigger: number;
  localSentMessage?: Message | null; // <-- optional local message
  userType: UserType;
  isNewClient: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  selectedUser,
  userId,
  newMessageTrigger,
  localSentMessage,
  userType,
  isNewClient,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [oldestMessageDate, setOldestMessageDate] = useState<string | null>(
    null
  );
  const [latestMessageDate, setLatestMessageDate] = useState<string | null>(
    null
  );
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const { selectedSeer } = useSeer();
  const [currentSenderId, setCurrentSenderId] = useState<number>(userId ?? -1);

  /* ─────────── notification-sound bookkeeping ─────────── */
  const playNotification = useNotificationSound();
  const lastPlayedIdRef = useRef<number | null>(null);
  const firstLoadRef = useRef(true);

  const getMessagesEndpoint = (
    id: number,
    creationDate?: string | null,
    page: number = 1
  ) => {
    if (userType === "SEER") {
      return creationDate
        ? `/api/chat/seer/messages?customer_id=${id}&seer_id=${
            selectedSeer?.user || userId
          }&creationDate=${creationDate}`
        : `/api/chat/seer/messages?customer_id=${id}&seer_id=${
            selectedSeer?.user || userId
          }&page=${page}`;
    } else {
      return creationDate
        ? `/api/chat/user/${id}/messages?creationDate=${creationDate}`
        : `/api/chat/user/${id}/messages?page=${page}`;
    }
  };

  useEffect(() => {
    if (selectedUser && !isNewClient) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser, isNewClient]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id, null, 1, true);
    }
  }, [newMessageTrigger]);

  useEffect(() => {
    // console.log("testign the loading after new messages");
    if (localSentMessage) {
      setMessages((prev) => [...prev, localSentMessage]);

      if (selectedUser && latestMessageDate) {
        fetchMessages(selectedUser.id, latestMessageDate, undefined, true);
      }
    }
  }, [localSentMessage]);

  useEffect(() => {
    if (!selectedUser) return;

    const interval = setInterval(async () => {
      if (!isUserAtBottom()) {
        // If user is NOT at bottom, fetch messages but don't auto-scroll
        await fetchMessages(selectedUser.id, null, 1, false);
        setHasNewMessages(true); // <-- show 'new messages' indicator
      } else {
        // If user IS at bottom, fetch messages normally
        await fetchMessages(selectedUser.id, null, 1, true);
      }
    }, 20000); // every 20 seconds

    return () => clearInterval(interval); // cleanup
  }, [selectedUser]);

  const fetchMessages = async (
    userId: number,
    creationDate: string | null = null,
    page = 1,
    isPolling = false
  ) => {
    if (!isPolling) setInitialLoading(true);
    setLoading(true);
    try {
      const endpoint = getMessagesEndpoint(userId, creationDate, page);
      const response = await ApiClient.get(endpoint);

      if (response.status === 200) {
        const fetchedMessages = response.data.results.reverse();
        if (page === 1 && !creationDate) {
          setMessages(fetchedMessages);
        } else if (creationDate) {
          // Prepending older messages
          setMessages((prev) => [...fetchedMessages, ...prev]);
          setTimeout(() => {
            if (scrollContainerRef.current) {
              const newScrollHeight = scrollContainerRef.current.scrollHeight;
              const scrollDifference =
                newScrollHeight - previousScrollHeightRef.current;
              scrollContainerRef.current.scrollTop = scrollDifference;
            }
          }, 0);
        } else {
          // Appending new messages
          setMessages((prev) => [...prev, ...fetchedMessages]);
          setTimeout(() => {
            if (scrollContainerRef.current) {
              const newScrollHeight = scrollContainerRef.current.scrollHeight;
              const scrollDifference =
                newScrollHeight - previousScrollHeightRef.current;
              scrollContainerRef.current.scrollTop = scrollDifference;
            }
          }, 0);
        }

        setNextUrl(response.data.next);
        setPreviousUrl(response.data.previous);

        if (response.data.results.length > 0) {
          setOldestMessageDate(
            formatDateForAPI(
              response.data.results[response.data.results.length - 1]
                .creation_date
            )
          );
          setLatestMessageDate(
            formatDateForAPI(response.data.results[0].creation_date)
          );
        }
      }
    } catch (error) {
      // console.error("Error fetching messages", error);
    } finally {
      setLoading(false);
      if (!isPolling) setInitialLoading(false); // done loading if not polling
      setIsLoadingOlder(false);
    }
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    if (scrollContainerRef.current.scrollTop < 100 && previousUrl) {
      previousScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
      loadOlderMessages();
    }

    if (isUserAtBottom()) {
      setHasNewMessages(false);
    }
  };

  const loadOlderMessages = async () => {
    if (!selectedUser || !oldestMessageDate || !previousUrl) return;
    setIsLoadingOlder(true);
    await fetchMessagesFromUrl(previousUrl, "prepend");
    // await fetchMessages(selectedUser.id, oldestMessageDate);
  };

  const fetchMessagesFromUrl = async (
    url: string,
    mode: "prepend" | "append" = "append"
  ) => {
    setLoading(true);
    try {
      const response = await ApiClient.get(url);

      if (response.status === 200) {
        const fetchedMessages = response.data.results.reverse(); // Oldest first

        if (mode === "prepend") {
          setMessages((prev) => [...fetchedMessages, ...prev]);
          setTimeout(() => {
            if (scrollContainerRef.current) {
              const newScrollHeight = scrollContainerRef.current.scrollHeight;
              const scrollDifference =
                newScrollHeight - previousScrollHeightRef.current;
              scrollContainerRef.current.scrollTop = scrollDifference;
            }
          }, 0);
        } else {
          setMessages((prev) => [...prev, ...fetchedMessages]);
        }

        setNextUrl(response.data.next);
        setPreviousUrl(response.data.previous);

        if (response.data.results.length > 0) {
          setOldestMessageDate(
            formatDateForAPI(
              response.data.results[response.data.results.length - 1]
                .creation_date
            )
          );
          setLatestMessageDate(
            formatDateForAPI(response.data.results[0].creation_date)
          );
        }
      }
    } catch (error) {
      console.error("Error fetching messages", error);
    } finally {
      setLoading(false);
      setIsLoadingOlder(false);
    }
  };

  const isUserAtBottom = () => {
    if (!scrollContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100; // 100px tolerance
  };

  /* ――― play sound when the OTHER user sends something new ――― */
  useEffect(() => {
    if (messages.length === 0) return;

    const latest = messages[messages.length - 1];

    // Skip on first historical load
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      lastPlayedIdRef.current = latest.id;
      return;
    }

    // Only notify if it's NOT you and we haven't played this one yet
    if (
      latest.sender !== currentSenderId &&
      latest.sender !== Number(selectedSeer?.user) &&
      latest.id !== lastPlayedIdRef.current
    ) {
      playNotification();
      lastPlayedIdRef.current = latest.id;
    }
  }, [messages, userId, playNotification]);

  useEffect(() => {
    if (selectedSeer?.user != null) {
      setCurrentSenderId(Number(selectedSeer.user));
    } else if (userId != null) {
      setCurrentSenderId(userId);
    }
  }, [selectedSeer, userId]);

  return (
    <ScrollArea
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 w-full overflow-y-auto p-4 space-y-4"
    >
      {initialLoading ? (
        <div className="flex justify-center items-center h-full text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Chargement des messages...
        </div>
      ) : (
        <>
          {isLoadingOlder && (
            <div className="flex justify-center py-4 text-muted-foreground text-xs md:text-sm">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Chargement des anciens messages...
            </div>
          )}

          {!isLoadingOlder && messages.length > 0 && (
            <div className="text-center text-xs text-muted-foreground py-2">
              Début de l'historique du chat
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.sender === currentSenderId ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 max-w-xs md:max-w-md break-words shadow-sm text-sm ${
                  message.sender === currentSenderId
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {message.body}
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                {message.creation_date
                  ? new Date(message.creation_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </div>
            </div>
          ))}
        </>
      )}
      <div ref={bottomRef} />
    </ScrollArea>
  );
};

export default ChatMessages;
