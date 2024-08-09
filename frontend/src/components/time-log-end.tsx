"use client";
import { format } from "date-fns";
import EndUsersSession from "./end-users-session";
import { components } from "@/lib/schema";

// this component must be client component, because it uses browser timezone
export default function TimeLogEnd({
  end,
  username,
  currentUser,
}: {
  end: string | null | undefined;
  username: string;
  currentUser: components["schemas"]["UserDTO"];
}) {
  if (end) return format(end, "hh:mm aa");
  return <EndUsersSession username={username} currentUser={currentUser} />;
}
