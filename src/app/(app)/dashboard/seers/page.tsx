import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Seer, Specialty } from "@/types/seer";
import { fetchAllSeers } from "@/services/seers";

export default async function SeerProfilesPage() {
  const seerProfiles = await fetchAllSeers();

  if (seerProfiles.length === 0) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Rencontrez Nos Voyants</h1>
        <p>Aucun voyant trouvé pour le moment. 🙏</p>
      </div>
    );
  }

  return (
    // Add padding here since it was removed from the main layout element
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Rencontrez Nos Voyants</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {seerProfiles?.map((seer: Seer) => (
          <Card
            key={seer.id}
            className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="relative p-0">
              <Image
                src={`https://picsum.photos/300/200?random=${Math.floor(
                  Math.random() * 1000
                )}`}
                alt={seer.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src={seer.imageUrl} alt={seer.name} />
                  <AvatarFallback>{seer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg capitalize">
                    {seer.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm text-amber-400">
                    {Array.from({ length: Math.round(seer.rating) }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                    <span>{seer.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              {/* Display the description here */}
              <CardDescription className="text-sm mb-3 flex-grow">
                {seer.description}
              </CardDescription>
              <div className="flex flex-wrap gap-1 mb-4">
                {seer?.specialties?.map((specialty: Specialty) => (
                  <Badge
                    key={specialty.id}
                    variant="outline"
                    className="text-xs"
                  >
                    {specialty.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" size="sm" asChild>
                {/* Link to a dynamic profile page or directly to chat */}
                <Link href={`/dashboard/seers/${seer.id}`}>
                  Voir Profil & Chatter
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
