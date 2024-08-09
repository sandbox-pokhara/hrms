"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCookie, getDuration } from "@/lib/utils";
import TimeLogStart from "@/components/time-log-start";
import TimeLogEnd from "@/components/time-log-end";
import { Checkbox } from "@/components/ui/checkbox";
import TableEmptyState from "@/components/table-empty-state";
import { components } from "@/lib/schema";
import { useMemo, useState } from "react";
import DeleteConfirmation from "@/components/delete-confirmation";
import { EditTimeLogs } from "./edit-time-logs";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  timeLogs: components["schemas"]["PagedTimeLogDTO"];
  currentUser: components["schemas"]["UserDTO"];
  projects: components["schemas"]["PagedProjectDTO"];
  activities: components["schemas"]["PagedActivityDTO"];
}

export default function DataTable({
  timeLogs,
  currentUser,
  projects,
  activities,
}: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedIds((prevSelectedIds) =>
      checked
        ? [...prevSelectedIds, id]
        : prevSelectedIds.filter((itemId) => itemId !== id)
    );
  };
  const selectedActiveSessionUsernames = useMemo(() => {
    const timelogItems = timeLogs.items.filter(
      (tl) => tl?.id && tl.end === null && selectedIds.includes(tl?.id)
    );
    return timelogItems.map((i) => i.user__username);
  }, [selectedIds]);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Time Logs</h1>
        {currentUser?.is_superuser && (
          <div className="ml-auto flex gap-2">
            <EditTimeLogs
              disabled={!selectedIds.length}
              timeLogIds={selectedIds}
              projects={projects}
              activities={activities}
            />
            <Button
              variant="outline"
              disabled={!selectedActiveSessionUsernames?.length}
              onClick={async () => {
                const csrftoken = getCookie("csrftoken");
                if (!csrftoken) return false;
                const res = await fetch("/api/time-logs/users/end/", {
                  method: "POST",
                  headers: {
                    "X-CSRFToken": csrftoken,
                  },
                  body: JSON.stringify({
                    usernames: selectedActiveSessionUsernames,
                  }),
                });
                if (res.ok) {
                  const data = await res.json();
                  toast({
                    title: data?.detail,
                  });
                } else {
                  toast({
                    title: "Something went wrong!",
                  });
                }
                router.refresh();
              }}
            >
              End Session
            </Button>
            <DeleteConfirmation
              disabled={!selectedIds.length}
              onSubmit={async () => {
                try {
                  const csrftoken = getCookie("csrftoken");
                  if (!csrftoken) return null;
                  const res = await fetch(`/api/time-logs/delete/`, {
                    method: "POST",
                    headers: {
                      "X-CSRFToken": csrftoken,
                    },
                    body: JSON.stringify({
                      time_log_ids: selectedIds,
                    }),
                  });
                  if (res.ok) {
                    toast({
                      title: `${selectedIds.length} Log item(s) deleted successfully.`,
                    });
                    router.refresh();
                  }
                } catch (err) {}
              }}
            />
          </div>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {currentUser?.is_superuser && (
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedIds.length === timeLogs?.items.length}
                  onCheckedChange={(checked: boolean) => {
                    checked
                      ? setSelectedIds([
                          ...timeLogs?.items.map((i) => (i.id ? i.id : 0)),
                        ])
                      : setSelectedIds([]);
                  }}
                />
              </TableHead>
            )}
            <TableHead>User</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Activity</TableHead>
          </TableRow>
        </TableHeader>
        {timeLogs?.items.length ? (
          <TableBody>
            {timeLogs.items.map((i) => (
              <TableRow key={i.id}>
                {currentUser?.is_superuser && (
                  <TableHead>
                    <Checkbox
                      checked={Boolean(i.id && selectedIds.includes(i.id))}
                      onCheckedChange={(checked: boolean) =>
                        i.id && handleCheckboxChange(i.id, !!checked)
                      }
                    />
                  </TableHead>
                )}
                <TableCell className="whitespace-nowrap inline-flex gap-1.5 items-center">
                  {i.user__username}
                  {!i.end && (
                    <div className="w-1.5 h-1.5 overflow-hidden rounded-full bg-green-500" />
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <TimeLogStart start={i.start} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <TimeLogEnd end={i.end} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {i.end
                    ? getDuration(new Date(i.start), new Date(i.end))
                    : getDuration(new Date(i.start), new Date())}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {i.project__name}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {i.activity__name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableEmptyState colSpan={7} message="No time logs found." />
        )}
      </Table>
    </>
  );
}
