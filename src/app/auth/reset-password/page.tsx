"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ApiClient from "@/utils/axiosbase";
import { LockOpenIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const validationSchema = z.object({
  email: z.string().email("Email invalide").min(1, "Le champ est obligatoire"),
});

type FormData = z.infer<typeof validationSchema>;

export default function ResetPassword(props: any) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = async (values: FormData) => {
    setSubmitting(true);
    setServerError("");

    try {
      await ApiClient.post("/auth/users/reset_password/", values);
      toast({
        title: "Succès",
        description: "Inscription réussie, veuillez vous connecter",
      });
    } catch (error: any) {
      setServerError(`Une erreur s’est produite. Veuillez réessayer.`);
      toast({
        title: "Erreur",
        description:
          error.message || `Une erreur s’est produite. Veuillez réessayer.`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-300">
            <LockOpenIcon className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Mot de passe oublié
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-center text-gray-600">
            Nous avons envoyé des instructions de réinitialisation à votre
            adresse e-mail
          </p>

          {serverError && (
            <p className="mb-4 rounded-md bg-red-100 p-2 text-center text-sm font-medium text-red-700">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="name@mail.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>{"S'il vous plaît, attendez"}</span>
                </div>
              ) : (
                "Soumettre"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-accent hover:underline"
            >
              Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
