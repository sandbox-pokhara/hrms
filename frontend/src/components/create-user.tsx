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

export function CreateUser() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const createUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username && !password) {
      toast({
        title: "Please fill all the fields.",
      });
      return;
    }
    try {
      const csrftoken = getCookie("csrftoken");
      if (!csrftoken) return null;
      const res = await fetch(`/api/users/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          username: username,
          password: password,
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
        title: "User created successfully.",
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
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={createUser}>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Provide a username and password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-start gap-2">
              <Label
                htmlFor="username"
                className="text-left max-w-[70px] w-full"
              >
                Username
              </Label>
              <Input
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label
                htmlFor="passwor"
                className="text-left max-w-[70px] w-full"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
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
