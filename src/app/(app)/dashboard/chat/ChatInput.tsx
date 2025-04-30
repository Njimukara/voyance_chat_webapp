"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: (message: string) => void;
  loading?: boolean; // Optional loading prop if you want
}

const MIN_WORD_COUNT = 20;

export function ChatInput({
  newMessage,
  setNewMessage,
  onSendMessage,
  loading,
}: ChatInputProps) {
  const { toast } = useToast();
  const getWordCount = (text: string) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wordCount = getWordCount(newMessage);

    if (wordCount >= MIN_WORD_COUNT) {
      onSendMessage(newMessage);
      setNewMessage(""); // Clear input after sending
    } else {
      toast({
        title: "Erreur Inattendue",
        description: `Le message doit contenir au moins ${MIN_WORD_COUNT} mots.`,
        variant: "destructive",
      });
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
        disabled={loading || getWordCount(newMessage) < MIN_WORD_COUNT}
      >
        <SendHorizonal className="h-4 w-4" />
      </Button>
    </form>
  );
}
