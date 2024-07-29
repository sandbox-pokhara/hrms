import MainLayout from "@/components/main-layout";
import type { Metadata } from "next";
import Pagination from "@/components/pagination";
import {
  getActivities,
  getCurrentUser,
  getProjects,
  getTimeLogs,
} from "@/lib/apiServer";
import DataTable from "./_components/data-table";

export const metadata: Metadata = {
  title: "Time Logs - Sandbox HRMS",
  description: "Human Resource Management System",
};

export default async function TimeLogs({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const page = parseInt(searchParams?.page || "1");
  const [timeLogs, currentUser, projects, activities] = await Promise.all([
    getTimeLogs(page),
    getCurrentUser(),
    getProjects(),
    getActivities(1, 100),
  ]);

  return (
    <MainLayout currentUser={currentUser} active="time-logs">
      <DataTable
        timeLogs={timeLogs}
        currentUser={currentUser}
        projects={projects}
        activities={activities}
      />
      <Pagination
        pageIndex={page}
        totalPages={
          timeLogs?.items.length !== 0
            ? Math.ceil((timeLogs?.count || 1) / 10)
            : 1
        }
        path="/time-logs/"
      />
    </MainLayout>
  );
}
