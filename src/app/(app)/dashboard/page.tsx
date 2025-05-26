"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, Users, ShoppingCart, Coins } from "lucide-react"; // Added Coins icon
import { useSession } from "next-auth/react";
import { UserType } from "@/types/general";
import { getUserRole } from "@/utils/apiConfig";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const userType: UserType = getUserRole(
    session?.user?.user_profile?.user_type
  );

  const router = useRouter();

  if (userType != "CLIENT") {
    router.replace("/dashboard/chat");
  }

  return (
    // Add padding here since it was removed from the main layout element
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4 md:p-6">
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Bon retour !</CardTitle>
          <CardDescription>
            Voici un aperçu rapide de votre compte Voyance.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 border rounded-lg bg-muted/40">
            <h3 className="text-lg font-semibold mb-2">Actions Rapides</h3>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="/dashboard/seers"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" /> Démarrer un nouveau Chat
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="/dashboard/seers"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" /> Parcourir les Voyants
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="/dashboard/purchase-credits"
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" /> Achats Des Credits
                </Link>
              </Button>
            </div>
          </div>
          {}
          <div className="p-4 border rounded-lg bg-muted/40 flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-semibold mb-2">Crédits Disponibles</h3>
            <p className="text-4xl font-bold text-primary flex items-center gap-2">
              {session?.user?.creditBalance}{" "}
              <Coins className="h-8 w-8 inline-block" />
            </p>
            <p className="text-sm text-muted-foreground -mt-1">crédits</p>
            <Button size="sm" className="mt-4" asChild>
              <Link href="/dashboard/purchase-credits">
                Acheter plus de Crédits
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
