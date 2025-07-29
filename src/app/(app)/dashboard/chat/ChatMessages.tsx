import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Message, UserDTO, UserType } from "@/types/general";
import { useEffect, useRef, useState } from "react";
import ApiClient from "@/utils/axiosbase";
import { formatDateForAPI } from "@/utils/apiConfig";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { useSeer } from "@/lib/SeerContext";
import { format, set } from "date-fns";
import { formatDateDivider, formatMessageTime } from "@/lib/utils";

interface ChatMessagesProps {
  selectedUser: UserDTO | null;
  userId: number | undefined;
  newMessageTrigger: number;
  localSentMessage?: Message | null; // <-- optional local message
  userType: UserType;
  isNewClient: boolean;
}
const groupMessagesByDay = (messages: Message[]) => {
  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime()
  );

  return sortedMessages.reduce((groups: Record<string, Message[]>, message) => {
    const dateKey = format(new Date(message.creation_date), "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});
};

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
  const [loadTimes, setLoadTimes] = useState(0);
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
  const lastPlayedIdRef = useRef<string | number | null>(null);
  const firstLoadRef = useRef(true);

  const getMessagesEndpoint = (
    id: number,
    creationDate?: string | null,
    page: number = 1
  ) => {
    if (userType === "SEER") {
      return creationDate
        ? `/api/chat/seer/messages?customer_id=${id}&seer_id=${
            selectedSeer?.id || userId
          }&creationDate=${creationDate}`
        : `/api/chat/seer/messages?customer_id=${id}&seer_id=${
            selectedSeer?.id || userId
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
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [newMessageTrigger]);

  useEffect(() => {
    if (localSentMessage) {
      setMessages((prev) => [...prev, localSentMessage]);

      if (selectedUser && latestMessageDate) {
        fetchMessages(selectedUser.id, latestMessageDate, undefined, true);
      }
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [localSentMessage]);

  useEffect(() => {
    if (!selectedUser) return;
    setMessages([]);
    fetchMessages(selectedUser.id, null, 1, false);

    const interval = setInterval(async () => {
      if (!isUserAtBottom()) {
        await fetchMessages(selectedUser.id, null, 1, true);
        setHasNewMessages(true);
      } else {
        await fetchMessages(selectedUser.id, null, 1, true);
      }
    }, 10000);

    return () => clearInterval(interval);
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
        setMessages((prev) => {
          // Remove temporary messages and deduplicate by id
          const filtered = prev.filter((msg) => !msg.isTemporary);
          const newMessages = fetchedMessages.filter(
            (newMsg: Message) => !filtered.find((msg) => msg.id === newMsg.id)
          );
          if (page === 1 && !creationDate) {
            return [...filtered, ...newMessages];
          } else if (creationDate) {
            return [...filtered, ...newMessages];
          } else {
            return [...filtered, ...newMessages];
          }
        });

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
      if (!isPolling) setInitialLoading(false);
      setIsLoadingOlder(false);
    }
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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
        const fetchedMessages = response.data.results.reverse();

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
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  useEffect(() => {
    if (messages.length === 0) return;

    const latest = messages[messages.length - 1];

    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      lastPlayedIdRef.current = latest.id;
      return;
    }

    // Only notify if it's NOT you and we haven't played this one yet
    if (
      latest.sender !== currentSenderId &&
      latest.id !== lastPlayedIdRef.current &&
      (selectedUser?.unread_message_count ?? 0) > 0
    ) {
      playNotification();
      lastPlayedIdRef.current = latest.id;
    }
  }, [messages, userId, playNotification]);

  useEffect(() => {
    if (selectedSeer?.id != null) {
      setCurrentSenderId(Number(selectedSeer.id));
      return;
    } else if (userId != null) {
      setCurrentSenderId(userId);
    }
  }, [selectedSeer, userId]);

  useEffect(() => {
    if (messages.length === 0) return;

    if (loadTimes < 0 || isUserAtBottom()) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setLoadTimes((prev) => prev + 1);
    }
  }, [messages.length]);

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

          {Object.entries(groupMessagesByDay(messages)).map(
            ([dateKey, msgs]) => (
              <div key={dateKey}>
                <div className="text-center text-xs text-muted-foreground py-1 sticky top-0 bg-background/80 backdrop-blur z-10">
                  {formatDateDivider(dateKey)}
                </div>

                {msgs.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col my-1 ${
                      message.sender === currentSenderId
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-1 py-2 max-w-xs md:max-w-md break-words shadow-sm text-sm ${
                        message.sender === currentSenderId
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {message.body}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {formatMessageTime(message.creation_date)}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}

      <div ref={bottomRef} />
    </ScrollArea>
  );
};

export default ChatMessages;
