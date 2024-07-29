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
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { DatePicker } from "./date-picker";
import { getCookie } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function AddHoliday() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>();
  const [name, setName] = useState<string>("");

  const addHoliday = async () => {
    if (!date && !name) {
      toast({
        title: "Please fill all the fields.",
      });
      return;
    }

    try {
      const csrftoken = getCookie("csrftoken");
      if (!csrftoken) return null;
      const res = await fetch(`/api/holidays/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          date: date?.toISOString().split("T")[0],
          name: name,
        }),
      });
      if (res.ok) {
        toast({
          title: "Absence submited successfully.",
        });
        router.refresh();
      }
      if (res.status === 401) router.push("/login/");
    } catch (err) {
      toast({
        title: "Something went wrong.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          Add Holiday
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Holiday</DialogTitle>
          <DialogDescription>Provide a name and date.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="name" className="text-left max-w-[70px] w-full">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="date" className="text-left max-w-[70px] w-full">
              Date
            </Label>
            <DatePicker date={date} onChange={(v) => setDate(v)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={addHoliday}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
