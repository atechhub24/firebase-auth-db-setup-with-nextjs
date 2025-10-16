"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { NavigationItem } from "@/hooks/use-menu-items";
import type { UserRole } from "@/lib/types/user.type";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SettingsItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface CommandPaletteProps {
  role: UserRole;
  navigationItems: NavigationItem[];
  settingsItems: SettingsItem[];
}

export function CommandPalette({
  role,
  navigationItems,
  settingsItems,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is on macOS
    if (typeof window !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(`/${role}${url}`);
  };

  const allItems = [
    ...navigationItems.filter((item) => item.roles.includes(role)),
    ...settingsItems,
  ];

  return (
    <>
      <p className="text-sm text-muted-foreground hidden md:flex items-center gap-2 rounded-md border bg-background px-3 py-1.5">
        <span className="hidden lg:inline">Press</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          {isMac ? (
            <span className="text-xs">⌘</span>
          ) : (
            <span className="text-xs">Ctrl</span>
          )}
          K
        </kbd>
        <span className="hidden lg:inline">to search</span>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {allItems.map((item) => (
              <CommandItem
                key={item.title}
                onSelect={() => handleSelect(item.url)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
