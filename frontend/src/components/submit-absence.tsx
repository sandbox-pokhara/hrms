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
import { isBefore } from "date-fns";

interface Props {
  remainigAbsences: number;
}

export function SubmitAbsence({ remainigAbsences }: Props) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>();
  const [description, setDescription] = useState<string>("");

  const submitAbsence = async () => {
    if (!date && !description) {
      toast({
        title: "Please fill all the fields.",
      });
      return;
    }
    const today = new Date();
    if (date && isBefore(date, today)) {
      toast({
        title: "Please select a valid date.",
      });
      return;
    }
    try {
      const csrftoken = getCookie("csrftoken");
      if (!csrftoken) return null;
      const res = await fetch(`http://localhost:8000/api/time-logs/start/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          date: date,
          description: description,
        }),
      });
      if (res.status === 401) router.push("/login/");
      if (!res.ok) return null;
      toast({
        title: "Absence submited successfully.",
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
        <Button
          size="sm"
          className="w-full"
          disabled={!Boolean(remainigAbsences)}
        >
          Submit Absences
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Absence</DialogTitle>
          <DialogDescription>Provide a descripton and date.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-start gap-2">
            <Label
              htmlFor="description"
              className="text-left max-w-[70px] w-full"
            >
              Description
            </Label>
            <Input
              id="description"
              onChange={(e) => setDescription(e.target.value)}
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
          <Button type="submit" onClick={submitAbsence}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
