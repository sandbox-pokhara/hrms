"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCookie } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "./ui/use-toast";

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const updatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New Password and Confirm Password don't match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      e.preventDefault();
      const csrftoken = getCookie("csrftoken");
      if (!csrftoken) {
        setError("CSRF token error.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/users/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          current_password: password,
          new_password: newPassword,
        }),
      });
      if (res.ok) {
        toast({
          title: "Password changed successfully.",
        });
      } else if (res.status === 400) {
        setError("Invalid credentails.");
        setLoading(false);
      } else if (res.status === 403) {
        router.push("/");
      } else {
        setError("Unknown error.");
        setLoading(false);
      }
    } catch (error) {
      setError("Unknown error.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={updatePassword}>
      <div className="grid gap-4 w-full max-w-[500px]">
        <div className="grid gap-2">
          <Label htmlFor="password">Current Password</Label>
          <Input
            placeholder="********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            type="password"
            placeholder="********"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            type="password"
            placeholder="********"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error ? (
          <p className="text-[0.8rem] font-medium text-destructive">{error}</p>
        ) : null}
        <Button type="submit" className="w-full" disabled={loading}>
          Update Password
        </Button>
      </div>
    </form>
  );
}
