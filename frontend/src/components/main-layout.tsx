import { Toaster } from "@/components/ui/toaster";
import { getActivities, getCurrentTimeLog, getProjects } from "@/lib/apiServer";
import { components } from "@/lib/schema";
import Header from "./header";
import Sidebar from "./sidebar";

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
    | "users"
    | "activities"
    | "projects"
    | "settings";
  currentUser: components["schemas"]["UserDTO"];
  children: React.ReactNode;
}>) {
  const [currentTimeLog, projects, activities] = await Promise.all([
    getCurrentTimeLog(),
    getProjects(),
    getActivities(1, 100),
  ]);

  return (
    <>
      <Toaster />
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar
          active={active}
          currentUser={currentUser}
          projects={projects}
          activities={activities}
          currentTimeLog={currentTimeLog}
          activeTitle={active}
        />
        <div className="flex flex-col">
          <Header
            active={active}
            currentUser={currentUser}
            projects={projects}
            activities={activities}
            currentTimeLog={currentTimeLog}
          />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
