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
  const [reason, setReason] = useState<string>("");

  const submitAbsence = async () => {
    if (!date && !reason) {
      toast({
        title: "Please fill all the fields.",
      });
      return;
    }

    if (date && new Date() < date) {
      toast({
        title: "Please select a valid date.",
      });
      return;
    }
    try {
      const csrftoken = getCookie("csrftoken");
      if (!csrftoken) return null;
      const res = await fetch(`/api/absence-balances/submit/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          date: date?.toISOString().split("T")[0],
          description: reason,
        }),
      });
      if (res.ok) {
        toast({
          title: "Absence submited successfully.",
        });
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
        <Button
          size="sm"
          className="w-full"
          disabled={!Boolean(remainigAbsences)}
        >
          Submit Absence
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
              Reason
            </Label>
            <Input
              id="description"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
