import MainLayout from "@/components/main-layout";
import PageUnderConstruction from "@/components/page-under-construction";
import { getCurrentUser } from "@/lib/apiServer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Summary - Sandbox HRMS",
  description: "Human Resource Management System",
};

export default async function TimeLogs() {
  const currentUser = await getCurrentUser();

  return (
    <MainLayout currentUser={currentUser} active="time-summary">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Time Summary</h1>
      </div>
      <PageUnderConstruction />
    </MainLayout>
  );
}
