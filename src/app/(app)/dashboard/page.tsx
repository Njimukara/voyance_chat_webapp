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

export default function DashboardPage() {
  const { data: session } = useSession();

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

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" /> Activité Récente
          </CardTitle>
          <CardDescription>
            Vos dernières interactions sur la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary">
                    {activity.type === "chat" && (
                      <MessageSquare className="h-2.5 w-2.5" />
                    )}
                    {activity.type === "purchase" && (
                      <ShoppingCart className="h-2.5 w-2.5" />
                    )}
                    {activity.type === "profile" && (
                      <Users className="h-2.5 w-2.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune activité récente trouvée.
              </p>
            )}
          </ul>
        </CardContent>
      </Card> */}
    </div>
  );
}
