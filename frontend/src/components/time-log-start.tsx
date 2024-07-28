"use client";
import { format } from "date-fns";

// this component must be client component, because it uses browser timezone
export default function TimeLogStart({ start }: { start: string }) {
  return format(start, "EEE MMM d hh:mm aa");
}
