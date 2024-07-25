import Link from "next/link";
import {
  BarChartHorizontal,
  CalendarCheck2,
  CalendarX2,
  FolderGit2,
  LineChart,
  MonitorCogIcon,
  Package2,
  Settings,
  UserRoundX,
  UsersRound,
} from "lucide-react";
import { components } from "@/lib/schema";
import TimeLogCard from "./time-log-card";

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

const activeLink =
  "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary";
const inactiveLink =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";

export default function Sidebar({
  active,
  currentUser,
  currentTimeLog,
  projects,
  activities,
}: Props) {
  return (
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
  );
}
