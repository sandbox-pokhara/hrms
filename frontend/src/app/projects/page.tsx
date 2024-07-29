import MainLayout from "@/components/main-layout";
import { getCurrentUser, getProjects } from "@/lib/apiServer";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Metadata } from "next";
import TimeLogStart from "@/components/time-log-start";
import Pagination from "@/components/pagination";
import { CreateProject } from "@/components/create-project";
import TableEmptyState from "@/components/table-empty-state";

export const metadata: Metadata = {
  title: "Time Logs - Sandbox HRMS",
  description: "Human Resource Management System",
};

export default async function Projects({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.is_superuser) redirect("/login/");
  const page = parseInt(searchParams?.page || "1");
  const projects = await getProjects(page);

  return (
    <MainLayout currentUser={currentUser} active={"projects"}>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Projects</h1>
        <CreateProject />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date Created</TableHead>
          </TableRow>
        </TableHeader>
        {projects?.items.length ? (
          <TableBody>
            {projects.items.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="whitespace-nowrap">{i.name}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <TimeLogStart start={i.date_created} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableEmptyState colSpan={2} message="No activites found." />
        )}
      </Table>
      <Pagination
        pageIndex={page}
        totalPages={
          projects?.items.length !== 0
            ? Math.ceil((projects?.count || 1) / 10)
            : 1
        }
        path="/projects/"
      />
    </MainLayout>
  );
}
