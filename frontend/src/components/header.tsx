import Link from "next/link";
import {
  BarChartHorizontal,
  CalendarCheck2,
  CalendarX2,
  FolderGit2,
  LineChart,
  Menu,
  MonitorCogIcon,
  Search,
  Settings,
  UserRoundX,
  UsersRound,
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
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { components } from "@/lib/schema";

const activeLink =
  "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary";
const inactiveLink =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";

interface Props {
  active:
    | "dashboard"
    | "time-logs"
    | "time-summary"
    | "holidays"
    | "absences"
    | "users"
    | "activities"
    | "projects"
    | "settings";
  currentUser: components["schemas"]["UserDTO"];
  currentTimeLog: components["schemas"]["TimeLogDTO"] | null;
  projects: components["schemas"]["PagedProjectDTO"];
  activities: components["schemas"]["PagedActivityDTO"];
}

export default function Header({
  active,
  currentUser,
  currentTimeLog,
  projects,
  activities,
}: Props) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-3 pt-2">
          <SheetHeader>
            <SheetTitle>
              <VisuallyHidden.Root>Sandbox HRMS</VisuallyHidden.Root>
            </SheetTitle>
            <SheetDescription>
              <VisuallyHidden.Root>Sidebar menus</VisuallyHidden.Root>
            </SheetDescription>
          </SheetHeader>
          <nav className="grid items-start text-sm font-medium">
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
              className={active === "time-summary" ? activeLink : inactiveLink}
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
            {currentUser?.is_superuser && (
              <>
                <Link
                  href="/users/"
                  className={active === "users" ? activeLink : inactiveLink}
                >
                  <UsersRound className="h-4 w-4" />
                  Users
                </Link>
                <Link
                  href="/activities/"
                  className={
                    active === "activities" ? activeLink : inactiveLink
                  }
                >
                  <MonitorCogIcon className="h-4 w-4" />
                  Activities
                </Link>
                <Link
                  href="/projects/"
                  className={active === "projects" ? activeLink : inactiveLink}
                >
                  <FolderGit2 className="h-4 w-4" />
                  Projects
                </Link>
              </>
            )}
            <Link
              href="/settings/"
              className={active === "settings" ? activeLink : inactiveLink}
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
              activeTitle={active}
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
              className="w-full appearance-none bg-background pl-8 shadow-none max-w-[500px]"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-[2px]">
        <ProfileDropdown currentUser={currentUser} />
      </div>
    </header>
  );
}
