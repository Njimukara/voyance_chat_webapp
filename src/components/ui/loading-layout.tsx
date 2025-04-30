import { Loader2 } from "lucide-react"; // If you are already using Lucide icons
import { cn } from "@/lib/utils"; // If you have a classNames util (optional)

export function LoadingLayout({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen w-full gap-4",
        className
      )}
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Chargement en cours...</p>
    </div>
  );
}
