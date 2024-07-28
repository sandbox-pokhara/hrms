"use client";

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
import { FormEvent, useState } from "react";
import { toast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { getCookie } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function CreateProject() {
  const router = useRouter();
  const [project, setProject] = useState<string>("");

  const createProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project) {
      toast({
        title: "Please fill all the fields.",
      });
      return;
    }
    try {
      const csrftoken = getCookie("csrftoken");
      if (!csrftoken) return null;
      const res = await fetch(`/api/projects/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          project: project,
        }),
      });
      if (res.status === 401) router.push("/login/");
      if (!res.ok) {
        toast({
          title: "Something went wrong!",
        });
        return;
      }
      toast({
        title: "Activity created successfully.",
      });
      router.refresh();
    } catch (err) {
      toast({
        title: "Something went wrong.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="w-fit flex items-center gap-1">
          <Plus size={14} />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={createProject}>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
            <DialogDescription>Provide a project name.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-start gap-2">
              <Label
                htmlFor="project"
                className="text-left max-w-[70px] w-full"
              >
                Project
              </Label>
              <Input
                id="project"
                onChange={(e) => setProject(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
