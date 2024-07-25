import Link from "next/link";
import {
  BarChartHorizontal,
  CalendarCheck2,
  CalendarX2,
  LineChart,
  Menu,
  Package2,
  Search,
  Settings,
  UserRoundX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProfileDropdown from "./profile-dropdown";
import TimeLogCard from "./time-log-card";
import { Toaster } from "@/components/ui/toaster";
import { getActivities, getCurrentTimeLog, getProjects } from "@/lib/apiServer";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { components } from "@/lib/schema";

const activeLink =
  "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary";
const inactiveLink =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";

export default async function MainLayout({
  active,
  currentUser,
  children,
}: Readonly<{
  active:
    | "dashboard"
    | "time-logs"
    | "time-summary"
    | "holidays"
    | "absences"
    | "settings";
  currentUser: components["schemas"]["UserDTO"];
  children: React.ReactNode;
}>) {
  const [currentTimeLog, projects, activities] = await Promise.all([
    getCurrentTimeLog(),
    getProjects(),
    getActivities(),
  ]);

  return (
    <>
      <Toaster />
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="">Sandbox HRMS</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <Link
                  href="/"
                  className={active === "dashboard" ? activeLink : inactiveLink}
                >
                  <LineChart className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/time-logs/"
                  className={active === "time-logs" ? activeLink : inactiveLink}
                >
                  <CalendarCheck2 className="h-4 w-4" />
                  Time Logs
                </Link>
                <Link
                  href="/time-summary/"
                  className={
                    active === "time-summary" ? activeLink : inactiveLink
                  }
                >
                  <BarChartHorizontal className="h-4 w-4" />
                  Time Summary{" "}
                </Link>
                <Link
                  href="/holidays/"
                  className={active === "holidays" ? activeLink : inactiveLink}
                >
                  <CalendarX2 className="h-4 w-4" />
                  Holidays
                </Link>
                <Link
                  href="/absences/"
                  className={active === "absences" ? activeLink : inactiveLink}
                >
                  <UserRoundX className="h-4 w-4" />
                  Absences
                </Link>
                <Link
                  href="/settings/"
                  className={active === "settings" ? activeLink : inactiveLink}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </nav>
            </div>
            <div className="mt-auto p-4">
              <TimeLogCard
                initial={currentTimeLog}
                projects={projects}
                activities={activities}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col overflow-auto">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetHeader>
                  <SheetTitle>
                    <VisuallyHidden.Root>Sandbox HRMS</VisuallyHidden.Root>
                  </SheetTitle>
                  <SheetDescription>
                    <VisuallyHidden.Root>Sidebar menus</VisuallyHidden.Root>
                  </SheetDescription>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="/"
                    className={
                      active === "dashboard" ? activeLink : inactiveLink
                    }
                  >
                    <LineChart className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/time-logs/"
                    className={
                      active === "time-logs" ? activeLink : inactiveLink
                    }
                  >
                    <CalendarCheck2 className="h-4 w-4" />
                    Time Logs
                  </Link>
                  <Link
                    href="/time-summary/"
                    className={
                      active === "time-summary" ? activeLink : inactiveLink
                    }
                  >
                    <BarChartHorizontal className="h-4 w-4" />
                    Time Summary{" "}
                  </Link>
                  <Link
                    href="/holidays/"
                    className={
                      active === "holidays" ? activeLink : inactiveLink
                    }
                  >
                    <CalendarX2 className="h-4 w-4" />
                    Holidays
                  </Link>
                  <Link
                    href="/absences/"
                    className={
                      active === "absences" ? activeLink : inactiveLink
                    }
                  >
                    <UserRoundX className="h-4 w-4" />
                    Absences
                  </Link>
                  <Link
                    href="/settings/"
                    className={
                      active === "settings" ? activeLink : inactiveLink
                    }
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </nav>
                <div className="mt-auto">
                  <TimeLogCard
                    initial={currentTimeLog}
                    projects={projects}
                    activities={activities}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center gap-[2px]">
              <ProfileDropdown currentUser={currentUser} />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
