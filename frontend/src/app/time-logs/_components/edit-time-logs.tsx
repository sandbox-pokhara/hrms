"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { getCookie } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { components } from "@/lib/schema";
import { DateTimePicker } from "@/components/date-time-picker";

interface Props {
  disabled: boolean;
  timeLogIds: number[];
  projects: components["schemas"]["PagedProjectDTO"];
  activities: components["schemas"]["PagedActivityDTO"];
}

export function EditTimeLogs({
  disabled,
  timeLogIds,
  projects,
  activities,
}: Props) {
  const router = useRouter();
  const [editProject, setEditProject] = useState<boolean>(false);
  const [editActivities, setEditActivities] = useState<boolean>(false);
  const [editStartTime, setEditStartTime] = useState<boolean>(false);
  const [editEndTime, setEditEndTime] = useState<boolean>(false);
  const [selectedActivityId, setSelectedActivityId] = useState<
    number | undefined
  >(undefined);
  const [selectedProjectId, setSelectedProjectId] = useState<
    number | undefined
  >(undefined);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);

  const onSubmit = async () => {
    if (!selectedActivityId && !selectedProjectId && !startTime && !endTime) {
      toast({
        title: "0 log item(s) edited.",
      });
      return;
    }

    try {
      const csrftoken = getCookie("csrftoken");
      if (!csrftoken) return null;
      const res = await fetch(`/api/time-logs/edit/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          time_log_ids: timeLogIds,
          activity_id: selectedActivityId,
          project_id: selectedProjectId,
          start_time: startTime,
          end_time: endTime,
        }),
      });
      if (res.ok) {
        toast({
          title: `${timeLogIds.length} Log item(s) edited successfully.`,
        });
        router.refresh();
      }
      setSelectedActivityId(undefined);
      setSelectedProjectId(undefined);
      if (res.status === 401) router.push("/login/");
    } catch (err) {
      setSelectedActivityId(undefined);
      setSelectedProjectId(undefined);
      toast({
        title: "Something went wrong.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={disabled}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Time Logs</DialogTitle>
          <DialogDescription>Bulk edit time logs.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-left max-w-[70px] w-full">
              Project
            </Label>
            <Checkbox
              checked={editProject}
              onCheckedChange={(v) => setEditProject(!!v)}
            />
            <Select
              onValueChange={(v) => setSelectedProjectId(+v)}
              disabled={!editProject}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {projects?.items?.length ? (
                  projects?.items.map((project, i) => (
                    <SelectItem value={String(project.id)} key={i}>
                      {project.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled={true}>
                    No Projects Found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="username" className="text-left max-w-[70px] w-full">
              Activity
            </Label>
            <Checkbox
              checked={editActivities}
              onCheckedChange={(v) => setEditActivities(!!v)}
            />
            <Select
              onValueChange={(v) => setSelectedActivityId(+v)}
              disabled={!editActivities}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Activity" />
              </SelectTrigger>
              <SelectContent>
                {activities?.items?.length ? (
                  activities?.items.map((activity, i) => (
                    <SelectItem value={String(activity.id)} key={i}>
                      {activity.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled={true}>
                    No Activities Found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="username" className="text-left max-w-[70px] w-full">
              Start Time
            </Label>
            <Checkbox
              checked={editStartTime}
              onCheckedChange={(v) => setEditStartTime(!!v)}
            />
            <DateTimePicker
              disabled={!editStartTime}
              value={startTime}
              onChange={setStartTime}
              hourCycle={12}
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="username" className="text-left max-w-[70px] w-full">
              End Time
            </Label>
            <Checkbox
              checked={editEndTime}
              onCheckedChange={(v) => setEditEndTime(!!v)}
            />
            <DateTimePicker
              disabled={!editEndTime}
              value={endTime}
              onChange={setEndTime}
              hourCycle={12}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={onSubmit}>
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
