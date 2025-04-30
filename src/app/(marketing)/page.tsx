import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Star,
  MessageCircle,
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  Lock,
  Lightbulb,
  Mail,
  Phone,
  Sparkles,
  Eye,
  Quote,
} from "lucide-react"; // Added Sparkles, Eye, Quote
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"; // Import Carousel components
// Import the client component for the contact form
import { ContactForm } from "./_components/contact-form";
import SeerShowcase from "./_components/SeerShowcase";

// Mock Data for Seer Showcase - Reuse or adapt from dashboard page if needed - Translated descriptions and specialties
const featuredSeers = [
  {
    id: "1",
    name: "Mystic Maisie",
    specialties: ["Tarot", "Amour"], // French
    avatar: "https://picsum.photos/seed/maisie-avatar/80/80", // Use picsum for placeholders
    rating: 4.8,
    description:
      "Vous guide à travers les complexités de l'amour avec le Tarot.",
  },
  {
    id: "2",
    name: "Oracle Olivia",
    specialties: ["Clairvoyance", "Rêves"], // French
    avatar: "https://picsum.photos/seed/olivia-avatar/80/80",
    rating: 4.9,
    description: "Déverrouille les secrets cachés dans vos rêves.",
  },
  {
    id: "3",
    name: "Astro Alex",
    specialties: ["Astrologie", "Prévisions"], // French
    avatar: "https://picsum.photos/seed/alex-avatar/80/80",
    rating: 4.7,
    description: "Naviguez vers votre avenir avec la sagesse des étoiles.",
  },
];

// Mock Testimonial Data - Translated text
const testimonials = [
  {
    id: "t1",
    name: "Sarah K.",
    location: "Paris, FR",
    text: "Maisie a apporté une telle clarté à ma situation amoureuse. Je me suis sentie comprise et autonome après notre discussion. Je recommande vivement !",
    avatar: "https://picsum.photos/seed/sarah-avatar/40/40",
  },
  {
    id: "t2",
    name: "David L.",
    location: "Londres, UK",
    text: "Les aperçus d'Olivia sur mes rêves récurrents étaient justes ! Cela m'a aidé à comprendre des schémas subconscients dont je n'étais pas conscient.",
    avatar: "https://picsum.photos/seed/david-avatar/40/40",
  },
  {
    id: "t3",
    name: "Chloe M.",
    location: "Berlin, DE",
    text: "Alex m'a donné une lecture astrologique fantastique qui a éclairé mon parcours professionnel. Je me sens beaucoup plus confiante maintenant !",
    avatar: "https://picsum.photos/seed/chloe-avatar/40/40",
  },
  {
    id: "t4",
    name: "Marco P.",
    location: "Rome, IT",
    text: "La plateforme est facile à utiliser, et la connexion avec un voyant s'est faite sans problème. Excellente expérience globale.",
    avatar: "https://picsum.photos/seed/marco-avatar/40/40",
  },
];

export default function HomePage() {
  // Form submission logic is handled within the ContactForm client component

  return (
    <div className="flex flex-col min-h-dvh">
      {" "}
      {/* Use dvh for better mobile viewport handling */}
      <main className="flex-1">
        {/* New Hero Section with Background Image */}
        <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background Image from public folder */}
          <div className="absolute inset-0 z-0">
            <Image
              src={"/images/hero-background.jpg"} // Use the local path
              alt="Arrière-plan mystique pour Voyance avec des éléments célestes et des cartes"
              fill
              style={{ objectFit: "cover" }}
              priority // Load the hero image quickly
              quality={85} // Adjust quality vs file size
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>{" "}
            {/* Adjusted gradient overlay */}
          </div>

          {/* Content */}
          <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
            <div className="flex flex-col items-center">
              <Badge
                variant="secondary"
                className="mb-4 text-sm py-1 px-3 bg-white/10 text-white border-white/20 backdrop-blur-sm"
              >
                <Sparkles className="mr-2 h-4 w-4 text-primary" /> Trouvez Votre
                Clarté
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg">
                La Clarté Commence Ici <br />
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-teal-400 to-teal-500">
                  Voyance Chat
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-gray-200 md:text-xl drop-shadow-md">
                Connectez-vous en direct avec des conseillers psychiques de
                confiance pour des aperçus sur l'amour, la carrière et le chemin
                de votre vie.
              </p>
              {/* Center buttons */}
              <div className="mt-8 flex flex-col gap-4 min-[400px]:flex-row justify-center">
                <Button
                  size="lg"
                  asChild
                  className="shadow-lg hover:shadow-primary/40 transition-shadow"
                >
                  <Link href="/register">Commencez Votre Lecture</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white/80 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
                >
                  <Link href="#seers">Rencontrez Nos Voyants</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-gray-300 drop-shadow">
                3 premières minutes gratuites pour les nouveaux utilisateurs !
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-background"
        >
          {/* Use container class with mx-auto for centering */}
          <div className="container mx-auto px-4 md:px-6 max-w-screen-lg">
            {" "}
            {/* Added max-w */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
                  Comment ça Marche
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Étapes Simples vers la Clarté
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                  Obtenir des conseils sur Voyance est simple. Suivez ces étapes
                  pour commencer votre voyage perspicace.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="grid gap-2 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserPlus className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">1. Créez un Compte</h3>
                <p className="text-sm text-muted-foreground">
                  Inscrivez-vous rapidement et gratuitement pour explorer nos
                  conseillers doués.
                </p>
              </div>
              {/* Card 2 */}
              <div className="grid gap-2 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">
                  2. Trouvez Votre Voyant
                </h3>
                <p className="text-sm text-muted-foreground">
                  Parcourez les profils détaillés et les spécialités pour
                  trouver la correspondance parfaite.
                </p>
              </div>
              {/* Card 3 */}
              <div className="grid gap-2 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">
                  3. Commencez Votre Chat
                </h3>
                <p className="text-sm text-muted-foreground">
                  Connectez-vous via un chat sécurisé en temps réel pour votre
                  lecture confidentielle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seer Section */}
        <SeerShowcase />

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 border-t border-border/10"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-screen-lg">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm text-muted-foreground">
                  Histoires de Clients
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Écoutez Notre Communauté
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-lg/relaxed">
                  Expériences réelles de personnes qui ont trouvé clarté et
                  guidance sur Voyance.
                </p>
              </div>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial) => (
                  <CarouselItem
                    key={testimonial.id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1 h-full">
                      <Card className="h-full flex flex-col justify-between shadow-sm bg-card">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={testimonial.avatar}
                                alt={testimonial.name}
                              />
                              <AvatarFallback>
                                {testimonial.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base font-semibold">
                                {testimonial.name}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {testimonial.location}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <Quote className="h-5 w-5 text-muted-foreground/50 mb-2 -ml-1" />
                          <p className="text-sm text-foreground leading-relaxed">
                            {testimonial.text}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-[-10px] md:left-[-20px] top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
              <CarouselNext className="absolute right-[-10px] md:right-[-20px] top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            </Carousel>
          </div>
        </section>

        {/* Why Trust Us Section */}
        <section
          id="why-trust-us"
          className="w-full py-12 md:py-24 lg:py-32 bg-background border-t border-border/10"
        >
          {/* Use container class with mx-auto for centering */}
          <div className="container mx-auto px-4 md:px-6 max-w-screen-lg">
            {" "}
            {/* Added max-w */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
                  Notre Engagement
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Pourquoi Choisir Voyance ?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                  Nous priorisons une expérience sûre, confidentielle et
                  perspicace pour votre exploration spirituelle.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="grid gap-2 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Conseillers Vérifiés</h3>
                <p className="text-sm text-muted-foreground">
                  Les voyants subissent un processus de sélection pour
                  l'authenticité et la pratique éthique.
                </p>
              </div>
              {/* Card 2 */}
              <div className="grid gap-2 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">
                  Lectures Confidentielles
                </h3>
                <p className="text-sm text-muted-foreground">
                  Vos conversations sont privées et sécurisées par cryptage.
                </p>
              </div>
              {/* Card 3 */}
              <div className="grid gap-2 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Aperçus Éclairants</h3>
                <p className="text-sm text-muted-foreground">
                  Gagnez en clarté et en perspective pour naviguer avec
                  confiance dans les questions de la vie.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section
          id="contact"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 border-t border-border/10"
        >
          {/* Container with max-width */}
          <div className="container mx-auto px-4 md:px-6 max-w-screen-lg">
            <div className="grid gap-10 lg:grid-cols-2">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm text-muted-foreground">
                    Contactez-Nous
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Prendre Contact
                  </h2>
                  <p className="text-muted-foreground md:text-lg/relaxed">
                    Vous avez des questions ou besoin d'aide ? Contactez-nous,
                    et notre équipe se fera un plaisir de vous aider.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 mt-1 text-primary" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">
                        Demandes Générales & Support
                      </p>
                      <Link
                        href="mailto:support@voyance.com"
                        className="text-primary hover:underline"
                      >
                        support@voyance.com
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-6 w-6 mt-1 text-primary" />
                    <div>
                      <h3 className="font-semibold">
                        Téléphone (Support : 9h - 17h CET)
                      </h3>
                      <p className="text-muted-foreground">
                        Appelez-nous pour une assistance immédiate
                      </p>
                      <Link
                        href="tel:+1234567890"
                        className="text-primary hover:underline disabled"
                        aria-disabled="true"
                        tabIndex={-1}
                      >
                        +1 (234) 567-890 (Bientôt disponible)
                      </Link>
                      {/* <span className="text-muted-foreground"> +1 (234) 567-890 (Bientôt disponible)</span> */}
                    </div>
                  </div>
                  {/* Consider adding Address or Social Media links here */}
                </div>
              </div>

              {/* Contact Form - Use the Client Component */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Envoyez-Nous un Message
                </h3>
                <ContactForm /> {/* Render the client component */}
              </div>
            </div>
          </div>
        </section>

        {/* Ready to Find Your Answers Section (CTA) */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-border/10 bg-gradient-to-tr from-primary/10 via-background to-secondary/10">
          {/* Use container class with mx-auto for centering */}
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6 max-w-screen-lg">
            {" "}
            {/* Added max-w */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Prêt à Découvrir Votre Chemin ?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Inscrivez-vous aujourd'hui pour votre compte gratuit et
                connectez-vous avec un conseiller de confiance. Vos 3 premières
                minutes sont offertes !
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button size="lg" className="w-full" asChild>
                <Link href="/register">Créez Votre Compte Gratuit</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-2 text-accent hover:text-accent/80"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
