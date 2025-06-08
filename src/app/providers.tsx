"use client";

import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider, useSession } from "next-auth/react";
import { SeerProvider } from "@/lib/SeerContext";
import emailjs from "@emailjs/browser";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { UserProvider } from "@/lib/UserContext";
import { AppUser } from "@/types/general";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "EUR",
    intent: "capture",
  };

  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "");
  }, []);

  return (
    <SessionProvider>
      <PayPalScriptProvider options={initialOptions}>
        <SeerProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster />
          </QueryClientProvider>
        </SeerProvider>
      </PayPalScriptProvider>
    </SessionProvider>
  );
}
