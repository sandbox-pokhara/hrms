import MainLayout from "@/components/main-layout";
import UpdatePasswordForm from "@/components/update-password";
import { getCurrentUser } from "@/lib/apiServer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - Sandbox HRMS",
  description: "Human Resource Management System",
};

export default async function Settings() {
  const currentUser = await getCurrentUser();

  return (
    <MainLayout currentUser={currentUser} active="settings">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>
      <UpdatePasswordForm currentUser={currentUser} />
    </MainLayout>
  );
}
