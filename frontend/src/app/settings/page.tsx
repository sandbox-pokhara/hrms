import MainLayout from "@/components/main-layout";
import UpdatePasswordForm from "@/components/update-password";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings - Sandbox HRMS",
  description: "Human Resource Management System",
};

export default function Settings() {
  const cookieStore = cookies();
  const sessionid = cookieStore.get("sessionid");
  if (!sessionid) redirect("/login/");

  return (
    <MainLayout active="settings">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>
      <UpdatePasswordForm />
    </MainLayout>
  );
}
