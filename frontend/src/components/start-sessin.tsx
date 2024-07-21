import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_HOST } from "@/lib/constants";
import { components } from "@/lib/schema";
import { getCookie } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "./ui/use-toast";

interface Props {
  onSubmit: (projectId: number, activityId: number) => void;
}

export function StartSession({ onSubmit }: Props) {
  const [activities, setActivities] = useState<
    components["schemas"]["ActivityDTO"][]
  >([]);
  const [projects, setProjects] = useState<
    components["schemas"]["ProjectDTO"][]
  >([]);
  const [selectedActivityId, setSelectedActivityId] = useState<
    number | undefined
  >(undefined);
  const [selectedProjectId, setSelectedProjectId] = useState<
    number | undefined
  >(undefined);

  const fetchProjects = async () => {
    const csrftoken = getCookie("csrftoken");
    if (!csrftoken) return null;
    try {
      const res = await fetch(`${API_HOST}/api/projects/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken,
        },
      });
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setProjects(data?.items);
    } catch (err) {}
  };

  const fetchActivities = async () => {
    const csrftoken = getCookie("csrftoken");
    if (!csrftoken) return null;
    try {
      const res = await fetch(`${API_HOST}/api/activities/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken,
        },
      });
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setActivities(data?.items);
    } catch (err) {}
  };

  useEffect(() => {
    fetchProjects();
    fetchActivities();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          Start Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Session</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-left max-w-[70px] w-full">
              Project
            </Label>
            <Select onValueChange={(v) => setSelectedProjectId(+v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project, i) => (
                  <SelectItem value={String(project.id)} key={i}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="username" className="text-left max-w-[70px] w-full">
              Activity
            </Label>
            <Select onValueChange={(v) => setSelectedActivityId(+v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Activity" />
              </SelectTrigger>
              <SelectContent>
                {activities.map((activity, i) => (
                  <SelectItem value={String(activity.id)} key={i}>
                    {activity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              if (!selectedProjectId || !selectedActivityId)
                return toast({
                  title: "Please select all fields.",
                });
              onSubmit(selectedProjectId, selectedActivityId);
            }}
          >
            Start Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
