import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MountainIcon } from "lucide-react"; // Using a generic icon for logo

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Container centers the content within the full-width header */}
      <div className="container mx-auto flex h-14 max-w-screen-lg items-center px-4 md:px-6">
        {" "}
        {/* Changed max-w and added mx-auto explicitly */}
        {/* Logo and potentially main site name */}
        <div className="mr-4 flex items-center">
          {" "}
          {/* Removed flex-1 md:flex-initial */}
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <MountainIcon className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              {" "}
              {/* Show on sm+ */}
              Voyance Chat
            </span>
          </Link>
        </div>
        {/* Navigation Links - Centered */}
        <nav className="flex flex-1 items-center justify-center gap-4 text-sm md:gap-6">
          {" "}
          {/* Use flex-1 and justify-center */}
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
        {/* Auth Buttons - Aligned to the right */}
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
