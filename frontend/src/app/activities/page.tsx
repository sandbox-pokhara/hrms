import { CreateActivity } from "@/components/create-activity";
import MainLayout from "@/components/main-layout";
import { getActivities, getCurrentUser } from "@/lib/apiServer";
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

export const metadata: Metadata = {
  title: "Time Logs - Sandbox HRMS",
  description: "Human Resource Management System",
};

export default async function Activities({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.is_superuser) redirect("/login/");
  const page = parseInt(searchParams?.page || "1");
  const activities = await getActivities(page);

  return (
    <MainLayout currentUser={currentUser} active={"activities"}>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Activities</h1>
        <CreateActivity />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date Created</TableHead>
          </TableRow>
        </TableHeader>
        {activities ? (
          <TableBody>
            {activities.items.map((i) => (
              <TableRow key={i.id}>
                <TableCell>{i.name}</TableCell>
                <TableCell>
                  <TimeLogStart start={i.date_created} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow className="text-center h-40 hover:bg-none text-muted-foreground">
              <TableCell colSpan={7}>No activites found.</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Pagination
        pageIndex={page}
        totalPages={
          activities?.items.length !== 0
            ? Math.ceil((activities?.count || 1) / 10)
            : 1
        }
        path="/activities/"
      />
    </MainLayout>
  );
}
