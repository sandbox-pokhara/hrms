"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils";
import { components } from "@/lib/schema";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

async function logout() {
  const csrftoken = getCookie("csrftoken");
  if (!csrftoken) return false;
  const res = await fetch("/api/auth/logout/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrftoken,
    },
  });
  return res.ok;
}

export default function ProfileDropdown({
  currentUser,
}: {
  currentUser: components["schemas"]["UserDTO"];
}) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
            <AvatarImage />
            <AvatarFallback>
              {currentUser.username.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{currentUser.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/settings/">Settings</Link>
        </DropdownMenuItem>
        {currentUser?.is_superuser && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/admin/")}
          >
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            if (await logout()) router.push("/login/");
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
