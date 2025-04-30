"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RegistrationSuccess() {
  return (
    <div className="flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Inscription réussie !
          </CardTitle>
          <CardDescription className="text-center">
            Merci de vous être inscrit. Un e-mail d’activation a été envoyé à
            votre adresse. Veuillez vérifier votre boîte de réception.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center items-center gap-4 text-sm text-blue-600">
            <a
              href="mailto:"
              className="flex items-center gap-2 hover:underline font-medium"
            >
              <Mail className="h-5 w-5" />
              E-mail
            </a>
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline font-medium"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png"
                alt="Gmail Icon"
                className="h-5 w-5"
              />
              Gmail
            </a>
            <a
              href="https://outlook.live.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline font-medium text-blue-600"
            >
              <img
                src="/images/outlook.svg"
                alt="Outlook Icon"
                className="h-5 w-5"
              />
              Outlook
            </a>
          </div>

          <div className="text-center text-sm">
            <Button>
              <Link href="/login">Retour à la connexion</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
