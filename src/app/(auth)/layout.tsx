import type { ReactNode } from "react";
import Link from "next/link";
import { MountainIcon } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
        >
          <img
            src="/images/logo/logo.png"
            alt="Voyance Chat Logo"
            className="h-6 w-6"
          />
          <span className="font-bold">Voyance Chat</span>
        </Link>
      </div>
      <main className="w-full max-w-md">{children}</main>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Voyance. Tous droits réservés.
      </footer>
    </div>
  );
}
