"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiClient from "@/utils/axiosbase";

const loginSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("Email ou mot de passe incorrect.");
        } else if (result.error === "Callback") {
          setError("Une erreur de configuration est survenue.");
        } else {
          setError(`Échec de la connexion: ${result.error}`);
        }
        toast({
          title: "Échec de la connexion",
          description: result.error ?? "Veuillez vérifier vos informations.",
          variant: "destructive",
        });
      } else if (result?.ok && !result.error) {
        const userDetailsRes = await ApiClient.get(`/auth/users/me/`);
        var usertype;
        if (userDetailsRes.status == 200) {
          usertype = userDetailsRes.data.user_profile.user_type;
        }
        toast({
          title: "Connexion réussie",
          description: "Redirection vers votre tableau de bord.",
          variant: "default",
        });
        // 1 == client
        var url = usertype != 1 ? "/dashboard/chat" : callbackUrl;
        router.push(url);
      } else {
        setError("Une erreur inattendue s'est produite lors de la connexion.");
        toast({
          title: "Erreur Inattendue",
          description: "Une erreur inattendue s'est produite.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Une erreur réseau ou inattendue s'est produite.");
      toast({
        title: "Erreur",
        description: "Impossible de contacter le serveur d'authentification.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Connexion</CardTitle>
        <CardDescription className="text-center">
          Entrez vos informations ci-dessous pour vous connecter à votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
            {error === "OAuthAccountNotLinked"
              ? "Cet email est déjà lié à un autre fournisseur. Essayez de vous connecter avec ce fournisseur."
              : error === "CredentialsSignin"
              ? "Email ou mot de passe invalide."
              : error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      {...field}
                      type="email"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Mot de passe</FormLabel>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline text-accent hover:text-accent/80"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Vous n'avez pas de compte ?{" "}
          <Link
            href="/register"
            className="underline text-accent hover:text-accent/80"
          >
            S'inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
