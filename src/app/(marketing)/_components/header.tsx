import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MountainIcon } from "lucide-react"; // Using a generic icon for logo
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-lg items-center px-4 md:px-6">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* <MountainIcon className="h-6 w-6 text-primary" /> */}
            <img
              src="/images/logo/logo.png"
              alt="Voyance Chat Logo"
              width={24}
              height={24}
            />
            <span className="font-bold sm:inline-block">Voyance Chat</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-center gap-4 text-sm md:gap-6">
          <Link
            href="/#how-it-works"
            className="transition-colors hover:text-foreground/80 text-muted-foreground hidden md:block"
          >
            Comment ça Marche
          </Link>
          <Link
            href="/#seers"
            className="transition-colors hover:text-foreground/80 text-muted-foreground hidden md:block"
          >
            Nos Voyants
          </Link>
          <Link
            href="/#why-trust-us"
            className="transition-colors hover:text-foreground/80 text-muted-foreground hidden md:block"
          >
            Pourquoi Nous Faire Confiance
          </Link>
          <Link
            href="/#contact"
            className="transition-colors hover:text-foreground/80 text-muted-foreground hidden md:block"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">S'inscrire</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
