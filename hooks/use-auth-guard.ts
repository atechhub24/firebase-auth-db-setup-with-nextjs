import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/hooks/use-app-store";

/**
 * Redirects authenticated users away from specified paths (e.g., signin, signup)
 * @param redirectPaths - Array of paths to redirect from when authenticated
 */
export function useAuthGuard(redirectPaths: string[] = ["/login"]) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    // If user is authenticated and on one of the redirect paths, redirect to their dashboard
    if (redirectPaths.includes(pathname) && user.role) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [user, pathname, router, redirectPaths]);
}
