"use client";
import { Button } from "@/components/ui/button";
import { components } from "@/lib/schema";
import { getCookie } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StartSession } from "./start-session";
import CountUp from "./count-up";
import { CircleStop } from "lucide-react";

export default function TimeLogCard({
  initial,
  projects,
  activities,
  activeTitle,
}: {
  initial: components["schemas"]["TimeLogDTO"] | null;
  projects: components["schemas"]["PagedProjectDTO"];
  activities: components["schemas"]["PagedActivityDTO"];
  activeTitle:
    | "dashboard"
    | "time-logs"
    | "time-summary"
    | "holidays"
    | "absences"
    | "users"
    | "activities"
    | "projects"
    | "settings";
}) {
  const router = useRouter();
  const [currentTimeLog, setCurrentTimeLog] = useState<
    components["schemas"]["TimeLogDTO"] | null
  >(initial);

  return currentTimeLog ? (
    <Button
      variant="outline"
      className="inline-flex gap-2 items-center border rounded h-8 px-2 cursor-pointer"
      onClick={async () => {
        const csrftoken = getCookie("csrftoken");
        if (!csrftoken) return false;
        const res = await fetch("/api/time-logs/end/", {
          method: "POST",
          headers: {
            "X-CSRFToken": csrftoken,
          },
        });
        document.title = `${activeTitle
          .split("-")
          .join(" ")
          .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
            letter.toUpperCase()
          )} - Sandbox HRMS`;
        if (res.status === 401) router.push("/login/");
        if (res.ok) setCurrentTimeLog(null);
        router.refresh();
      }}
    >
      <CircleStop size={16} />
      <CountUp date={new Date(currentTimeLog?.start)} title={activeTitle} />
    </Button>
  ) : (
    <StartSession
      onSubmit={async (projectId, activityId) => {
        const csrftoken = getCookie("csrftoken");
        if (!csrftoken) return null;
        const res = await fetch(`/api/time-logs/start/`, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({
            project: projectId,
            activity: activityId,
          }),
        });
        if (res.status === 401) router.push("/login/");
        if (!res.ok) return null;
        const data = await res.json();
        if (data) setCurrentTimeLog(data);
        router.refresh();
      }}
      projects={projects}
      activities={activities}
    />
  );
}
