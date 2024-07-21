"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_HOST } from "@/lib/constants";
import { getCookie } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <form
      onSubmit={async (e) => {
        setLoading(true);
        setError("");
        e.preventDefault();
        const csrftoken = getCookie("csrftoken");
        if (!csrftoken) return false;
        const res = await fetch(`${API_HOST}/api/auth/login/`, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });
        if (res.ok) {
          router.push("/");
        } else if (res.status === 400) {
          setError("Invalid credentails.");
          setLoading(false);
        } else {
          {
            setError("Unknown error.");
            setLoading(false);
          }
        }
      }}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            placeholder="johndoe"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? (
          <p className="text-[0.8rem] font-medium text-destructive">{error}</p>
        ) : null}
        <Button type="submit" className="w-full" disabled={loading}>
          Login
        </Button>
      </div>
    </form>
  );
}
