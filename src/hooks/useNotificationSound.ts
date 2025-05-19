// hooks/useNotificationSound.ts
import { useRef } from "react";

export function useNotificationSound(src: string = "/sounds/notification.wav") {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current) {
    audioRef.current = typeof Audio !== "undefined" ? new Audio(src) : null;
  }

  const play = () => {
    audioRef.current?.play().catch((err) => {
      // Some browsers block autoplay without interaction
      console.warn("Unable to play notification sound", err);
    });
  };

  return play;
}
