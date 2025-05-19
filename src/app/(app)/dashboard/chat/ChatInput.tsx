"use client";

import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { UserType } from "@/types/general";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: (message: string) => void;
  loading?: boolean;
  userType: UserType;
}

const MIN_WORD_COUNT = 10;

export function ChatInput({
  newMessage,
  setNewMessage,
  onSendMessage,
  loading,
  userType,
}: ChatInputProps) {
  const { toast } = useToast();
  const getWordCount = (text: string) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wordCount = getWordCount(newMessage);

    if (userType === "CLIENT" && wordCount > 1) {
      onSendMessage(newMessage);
      setNewMessage("");
    } else {
      toast({
        title: "Erreur Inattendue",
        description: `Le message ne peut pas être vide.`,
        variant: "destructive",
      });
      return;
    }

    if (userType != "CLIENT" && wordCount >= MIN_WORD_COUNT) {
      onSendMessage(newMessage);
      setNewMessage("");
    } else {
      toast({
        title: "Erreur Inattendue",
        description: `Le message doit contenir au moins ${MIN_WORD_COUNT} mots.`,
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center space-x-2 p-4 border-t bg-card"
    >
      <Textarea
        id="message"
        placeholder="Écrivez votre message..."
        className="flex-1 resize-none p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        aria-label="Saisie du message de chat"
        disabled={loading}
        rows={3}
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Envoyer le message"
        disabled={loading}
      >
        <SendHorizonal className="h-4 w-4" />
      </Button>
    </form>
  );
}
