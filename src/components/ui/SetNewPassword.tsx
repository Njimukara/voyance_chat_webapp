import React, { useState } from "react";
import Modal from "./Modal";
import ApiClient from "@/utils/axiosbase";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface SetNewPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const passwordSchema = z.object({
  current_password: z
    .string()
    .min(1, { message: "Le mot de passe actuel est requis" }),
  new_password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .refine((val) => val.length > 0, {
      message: "Un nouveau mot de passe est requis",
    }), // Ensure it's non-empty
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const SetNewPassword: React.FC<SetNewPasswordModalProps> = ({
  open,
  onClose,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      setLoading(true);
      const response = await ApiClient.post(
        `/auth/users/set_password/`,
        values
      );
      if (!response.status.toString().startsWith("2")) {
        toast({
          title: "Erreur Inattendue",
          description:
            "Échec de la mise à jour du mot de passe. Veuillez réessayer.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Mot de passe mis à jour avec succès.",
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
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-5">
        {/* Password Icon */}
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
              d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3M5.25 10.5h13.5m-10.5 3v3m7.5-3v3m-6 3h4.5"
            />
          </svg>
        </div>

        <h2 className="text-lg text-black font-semibold">
          Définir un nouveau mot de passe
        </h2>

        {/* Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          {/* Current Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe actuel
            </label>
            <input
              type="password"
              {...register("current_password")}
              className="w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:outline-none"
              placeholder="Entrer le mot de passe actuel"
            />
            {errors.current_password && (
              <p className="text-sm text-red-500">
                {errors.current_password.message}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              {...register("new_password")}
              className="w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:outline-none"
              placeholder="Entrer un nouveau mot de passe"
            />
            {errors.new_password && (
              <p className="text-sm text-red-500">
                {errors.new_password.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="default" type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Définir le mot de passe"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SetNewPassword;
