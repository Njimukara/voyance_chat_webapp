// hooks/useNotificationSound.ts
import { useRef, useCallback } from "react";

export function useNotificationSound(src: string = "/sounds/notification.wav") {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current && typeof Audio !== "undefined") {
    audioRef.current = new Audio(src);
  }

  const play = useCallback(() => {
    audioRef.current?.play().catch((err) => {
      console.warn("Unable to play notification sound", err);
    });
  }, []);

  return play;
}
