"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

export default function CommandMenu({ isSuperUser }: { isSuperUser: boolean }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const menus = React.useMemo(() => {
    const baseMenus = [
      {
        name: "Dashboard",
        path: "/",
      },
      {
        name: "Time Logs",
        path: "/time-logs/",
      },
      {
        name: "Time Summary",
        path: "/time-summary/",
      },
      {
        name: "Holidays",
        path: "/holidays/",
      },
      {
        name: "Absences",
        path: "/absences/",
      },
      {
        name: "Settings",
        path: "/settings/",
      },
    ];

    const superUserMenus = [
      {
        name: "Users",
        path: "/users/",
      },
      {
        name: "Activities",
        path: "/activities/",
      },
      {
        name: "Projects",
        path: "/projects/",
      },
    ];

    return isSuperUser ? [...baseMenus, ...superUserMenus] : baseMenus;
  }, [isSuperUser]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 max-w-[500px]"
        )}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2.2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search..."
          value={query}
          onValueChange={(value) => setQuery(value)}
          autoFocus
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandSeparator />
          <CommandGroup heading="Menus">
            {menus
              .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
              .map((m, i) => (
                <CommandItem
                  key={i}
                  onSelect={() => {
                    runCommand(() => router.push(m.path));
                  }}
                  className="cursor-pointer"
                >
                  {m.name}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
