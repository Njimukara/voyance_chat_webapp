"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  FieldErrors,
} from "react-hook-form";
import ApiClient from "@/utils/axiosbase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for validation
const validationSchema = z.object({
  email: z.string().email("Email invalide").min(1, "Le champ est obligatoire"),
});
type FormData = z.infer<typeof validationSchema>;

export default function ResendEmail() {
  const router = useRouter();
  const [canResend, setCanResend] = useState(true);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!canResend && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [canResend, secondsLeft]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanResend(true);
    }
  }, [secondsLeft]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setError("");

    try {
      await ApiClient.post(`/auth/users/resend_activation/`, values);
      setCanResend(false);
      setSecondsLeft(60);
    } catch (err) {
      setCanResend(true);
      setError("Erreur lors de l'envoi de l'activation.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Réenvoyer le lien d'activation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="my-4 w-full rounded-lg bg-red-100 p-2 text-center text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                {...register("email")}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                placeholder="m@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">
                  {(errors.email as any).message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={!canResend}>
              {canResend
                ? "Renvoyer l'activation"
                : `Réessayez dans ${secondsLeft}s`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
