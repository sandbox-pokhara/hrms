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

export function CreateActivity() {
  const router = useRouter();
  const [activity, setActivity] = useState<string>("");

  const createActivity = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activity) {
      toast({
        title: "Please fill all the fields.",
      });
      return;
    }
    try {
      const csrftoken = getCookie("csrftoken");
      if (!csrftoken) return null;
      const res = await fetch(`/api/activities/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          activity: activity,
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
    } catch (err) {
      toast({
        title: "Something went wrong.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="w-fit">
          Create Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={createActivity}>
          <DialogHeader>
            <DialogTitle>Create Activity</DialogTitle>
            <DialogDescription>Provide a activity name.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-start gap-2">
              <Label
                htmlFor="activity"
                className="text-left max-w-[70px] w-full"
              >
                Activity
              </Label>
              <Input
                id="activity"
                onChange={(e) => setActivity(e.target.value)}
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
