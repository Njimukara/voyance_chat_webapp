import Link from "next/link";
import { MountainIcon } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left px-4 md:px-6 max-w-screen-lg">
        <div className="flex items-center space-x-2">
          <img
            src="/images/logo/logo.png"
            alt="Voyance Chat Logo"
            width={24}
            height={24}
          />
          <span className="font-bold">Voyance Chat</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link
            href="/#how-it-works"
            className="transition-colors hover:text-foreground"
          >
            Comment ça Marche
          </Link>
          <Link
            href="/#seers"
            className="transition-colors hover:text-foreground"
          >
            Nos Voyants
          </Link>
          <Link
            href="/#contact"
            className="transition-colors hover:text-foreground"
          >
            Contactez-Nous
          </Link>
          <Link
            href="/terms"
            className="transition-colors hover:text-foreground"
          >
            Conditions
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            Confidentialité
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground md:text-sm">
          © {new Date().getFullYear()} Voyance. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
