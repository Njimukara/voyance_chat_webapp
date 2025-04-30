"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, Loader2, Camera } from "lucide-react";
import ApiClient from "@/utils/axiosbase"; // adjust the import if needed
import { useSession } from "next-auth/react";
import { UserType } from "@/types/general";
import { getUserRole } from "@/utils/apiConfig";
import SetNewPassword from "@/components/ui/SetNewPassword";
import SetNewEmail from "@/components/ui/SetNewEmail";

const profileSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis." }),
  email: z.string().email({ message: "Adresse email invalide." }),
  phone_number: z.string().optional(),
  user_type: z.string().optional(),
  creditBalance: z.number().optional(),
  date_joined: z.union([z.date(), z.any()]).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [isNewPasswordOpen, setIsNewPasswordOpen] = useState(false);
  const [isNewEmailOpen, setIsNewEmailOpen] = useState(false);
  const { data: session } = useSession();
  const userType: UserType = getUserRole(
    session?.user?.user_profile?.user_type
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
    },
  });

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      setError(null);
      setIsFetchingProfile(true);
      try {
        const response = await ApiClient.get(`/auth/users/me/`);
        const userData = response.data;

        form.reset({
          name: userData?.name || "",
          email: userData?.email || "",
          phone_number: userData?.user_profile?.phone_number || "",
          creditBalance: userData.creditBalance,
          date_joined: userData?.date_joined
            ? new Date(userData.date_joined)
            : undefined,
        });

        setAvatarPreview(userData?.user_profile?.avatar || null);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil utilisateur.",
          variant: "destructive",
        });
        setError("Impossible de charger le profil utilisateur.");
      } finally {
        setIsFetchingProfile(false);
      }
    };

    fetchUserProfile();
  }, [form, toast]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("user_profile.phone_number", values.phone_number || "");
      if (avatarFile) {
        formData.append("user_profile.avatar", avatarFile);
      }

      const response = await ApiClient.put(`/auth/users/me/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Profil mis à jour",
        description:
          "Vos informations de profil ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setError("Impossible de mettre à jour votre profil.");
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 flex justify-center items-start">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <UserIcon className="h-6 w-6" /> Votre Profil
          </CardTitle>
          <CardDescription>
            Consultez et mettez à jour vos informations personnelles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Display error message */}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
              {error}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage
                      src={avatarPreview ?? undefined}
                      alt="Avatar"
                    />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  <Label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="h-6 w-6 text-white" />
                    <span className="sr-only">Changer l'avatar</span>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleAvatarChange}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur l'image pour changer l'avatar
                </p>
              </div>

              {/* Form Fields */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Votre nom complet"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        {...field}
                        readOnly={true}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsNewEmailOpen(true)}
                      className="mt-2"
                    >
                      Modifier l'Email
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de Passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="voyancechat"
                        {...field}
                        readOnly={true}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsNewPasswordOpen(true)}
                      className="mt-2"
                    >
                      Modifier mode de passe
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Votre numéro"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6">
                <h3 className="text-xs font-medium text-muted-foreground">
                  Informations du compte
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                {userType === "CLIENT" && (
                  <div className="space-y-2">
                    <Label>Crédits Restants</Label>
                    <Input
                      value={`${form.getValues("creditBalance") ?? 0} crédits`}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Type d'utilisateur</Label>
                  <Input
                    value={userType}
                    className="bg-muted cursor-not-allowed"
                  />
                </div>

                {/* Date Joined */}
                <div className="space-y-2">
                  <Label>Date d'inscription</Label>
                  <Input
                    value={
                      form.getValues("date_joined")
                        ? new Date(
                            form.getValues("date_joined")
                          ).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "" // Return empty string if date_joined is undefined
                    }
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer les Modifications"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <SetNewPassword
        open={isNewPasswordOpen}
        onClose={() => setIsNewPasswordOpen(false)}
      />

      <SetNewEmail
        open={isNewEmailOpen}
        onClose={() => setIsNewEmailOpen(false)}
      />
    </div>
  );
}
