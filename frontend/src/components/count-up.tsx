"use client";

import { getDuration } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function CountUp({
  date,
  title,
}: {
  date: Date;
  title: string;
}) {
  const [now, setNow] = useState(new Date());
  const duration = getDuration(date, now);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());

      document.title = `${getDuration(new Date(date), new Date())} - ${title
        .split("-")
        .join(" ")
        .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
          letter.toUpperCase()
        )} - Sandbox HRMS`;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div suppressHydrationWarning>{duration}</div>;
}
