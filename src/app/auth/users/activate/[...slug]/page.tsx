"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ApiClient from "@/utils/axiosbase";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SuccesVerifyEmail({ providers }: any) {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const display = async () => {
    const { slug } = params;
    if (!Array.isArray(slug) || slug.length < 2) {
      setError("Invalid Slug Format");
      setLoading(false);
      return;
    }

    const [uid, token] = slug;
    if (uid && token) {
      try {
        await ApiClient.post("/auth/users/activation/", { uid, token });
        setError("");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err: any) {
        setError(
          err.response?.data?.detail ||
            "Il y a une erreur avec l'e-mail de vérification"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    display();
  }, [params]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen p-6">
          <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Activation du compte
              </CardTitle>
              <CardDescription className="text-center">
                Activation du compte en cours...
              </CardDescription>
            </CardHeader>
            <CardContent className="mb-4 flex justify-center items-center">
              <div className="h-16 w-16 animate-spin rounded-full border-8 border-gray-300 border-t-blue-500"></div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!error) {
      return (
        <div className="flex items-center justify-center min-h-screen p-6">
          <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Activation réussie
              </CardTitle>
              <CardDescription className="text-center">
                Votre compte a été activé avec succès
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <CheckCircleIcon className="h-36 w-36 text-green-500 animate-bounce" />
              <p className="text-2xl font-bold mt-4">Compte activé !</p>
              <Button onClick={() => router.push("/login")}>
                Procéder à la connexion
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Activation échouée
            </CardTitle>
            <CardDescription className="text-center">
              Nous avons rencontré une erreur lors de l'activation de votre
              compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <XCircleIcon className="h-20 w-20 text-red-500" />
            {error && (
              <p className="my-4 w-full rounded-lg bg-red-100 p-2 text-center text-sm font-medium text-red-700">
                {error}
              </p>
            )}
            <Button onClick={() => router.push("/auth/resend-email")}>
              Renvoyer le lien d’activation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return renderContent();
}
