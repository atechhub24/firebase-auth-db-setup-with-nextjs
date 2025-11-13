import Link from "next/link";
import { marketingSite } from "@/lib/marketing-config";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16">
      <div className="mb-8 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Compass className="size-8" />
      </div>
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
        404 — Not Found
      </p>
      <h1 className="mt-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
        Lost in the Firebase Forest
      </h1>
      <p className="mt-3 max-w-xl text-center text-muted-foreground">
        We couldn&apos;t find the route you&apos;re looking for. Explore the latest from{" "}
        <span className="font-medium text-foreground">
          {marketingSite.title}
        </span>{" "}
        or head back to home base.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button asChild variant="default">
          <Link href="/" className="flex items-center gap-2">
            <Home className="size-4" />
            Go home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/blogs" className="flex items-center gap-2">
            <ArrowLeft className="size-4" />
            View blogs
          </Link>
        </Button>
      </div>
    </div>
  );
}

