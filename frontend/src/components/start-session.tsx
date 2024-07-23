import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { components } from "@/lib/schema";
import { useState } from "react";
import { toast } from "./ui/use-toast";

interface Props {
  onSubmit: (projectId: number, activityId: number) => void;
  projects: components["schemas"]["PagedProjectDTO"];
  activities: components["schemas"]["PagedActivityDTO"];
}

export function StartSession({ onSubmit, projects, activities }: Props) {
  const [selectedActivityId, setSelectedActivityId] = useState<
    number | undefined
  >(undefined);
  const [selectedProjectId, setSelectedProjectId] = useState<
    number | undefined
  >(undefined);

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
          <DialogDescription>Select project and activity.</DialogDescription>
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
                {projects?.items.map((project, i) => (
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
                {activities?.items.map((activity, i) => (
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
