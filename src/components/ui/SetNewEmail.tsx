import React, { useState } from "react";
import Modal from "./Modal";
import ApiClient from "@/utils/axiosbase";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface SetNewEmailModalProps {
  open: boolean;
  onClose: () => void;
}

const emailSchema = z.object({
  current_password: z
    .string()
    .min(1, { message: "Le mot de passe est requis" }),
  new_email: z
    .string()
    .email("Format d'e-mail invalide")
    .min(1, "Un nouvel e-mail est requis"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const SetNewEmail: React.FC<SetNewEmailModalProps> = ({ open, onClose }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (values: EmailFormValues) => {
    try {
      setIsSaving(true);
      const response = await ApiClient.post(`/auth/users/set_email/`, values);
      if (!response.status.toString().startsWith("2")) {
        toast({
          title: "Erreur Inattendue",
          description:
            "Échec de la mise à jour de l'e-mail. Veuillez réessayer.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "L'e-mail a été mis à jour avec succès.",
          variant: "destructive",
        });
        onClose(); // Close the modal after successful submission
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-5">
        {/* Email Icon */}
        <div className="pt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7.5l9 6 9-6M3 9v6a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 15V9"
            />
          </svg>
        </div>

        <h2 className="text-lg text-black font-semibold">
          Définir un nouvel e-mail
        </h2>

        {/* Email Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          {/* Current Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              {...register("current_password")}
              className="w-full rounded-md border text-black border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Entrer le mot de passe"
            />
            {errors.current_password && (
              <p className="text-sm text-red-500">
                {errors.current_password.message}
              </p>
            )}
          </div>

          {/* New Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nouvel e-mail
            </label>
            <input
              type="email"
              {...register("new_email")}
              className="w-full rounded-md border text-black border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Entrer un nouvel e-mail"
            />
            {errors.new_email && (
              <p className="text-sm text-red-500">{errors.new_email.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Enregistrement..." : "Définir l’e-mail"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SetNewEmail;
