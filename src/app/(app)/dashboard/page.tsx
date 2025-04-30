
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, Users, ShoppingCart, Activity, Coins } from "lucide-react"; // Added Coins icon

export default function DashboardPage() {
  // Mock data - replace with actual data fetching
  const recentActivity = [
    { id: 1, type: 'chat', description: 'Chat commencé avec Mystic Maisie', time: 'Il y a 2 heures' },
    { id: 2, type: 'purchase', description: 'Achat de 30 crédits', time: 'Il y a 1 jour' }, // Changed to credits
    { id: 3, type: 'profile', description: 'Profil de Oracle Olivia consulté', time: 'Il y a 3 jours' },
  ];
  const availableCredits = 45; // Example credits

  return (
    // Add padding here since it was removed from the main layout element
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4 md:p-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Bon retour !</CardTitle>
          <CardDescription>Voici un aperçu rapide de votre compte Voyance.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 border rounded-lg bg-muted/40">
            <h3 className="text-lg font-semibold mb-2">Actions Rapides</h3>
            <div className="flex flex-col gap-2">
               <Button variant="outline" size="sm" asChild>
                 <Link href="/dashboard/chat" className="flex items-center gap-2">
                   <MessageSquare className="h-4 w-4" /> Démarrer un nouveau Chat
                 </Link>
               </Button>
               <Button variant="outline" size="sm" asChild>
                 <Link href="/dashboard/seers" className="flex items-center gap-2">
                   <Users className="h-4 w-4" /> Parcourir les Voyants
                 </Link>
               </Button>
               <Button variant="outline" size="sm" asChild>
                 <Link href="/dashboard/purchases" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Voir les Achats
                 </Link>
               </Button>
            </div>
          </div>
           <div className="p-4 border rounded-lg bg-muted/40 flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-semibold mb-2">Crédits Disponibles</h3>
             {/* Updated text to "crédits" */}
            <p className="text-4xl font-bold text-primary flex items-center gap-2">{availableCredits} <Coins className="h-8 w-8 inline-block" /></p>
             <p className="text-sm text-muted-foreground -mt-1">crédits</p>
            <Button size="sm" className="mt-4" asChild>
               <Link href="/dashboard/purchase-credits">
                  Acheter plus de Crédits
               </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" /> Activité Récente
          </CardTitle>
          <CardDescription>Vos dernières interactions sur la plateforme.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-start gap-3 text-sm">
                   <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary">
                     {/* Simple icon mapping based on type */}
                     {activity.type === 'chat' && <MessageSquare className="h-2.5 w-2.5" />}
                     {activity.type === 'purchase' && <ShoppingCart className="h-2.5 w-2.5" />}
                     {activity.type === 'profile' && <Users className="h-2.5 w-2.5" />}
                   </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune activité récente trouvée.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
