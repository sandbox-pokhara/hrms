import MainLayout from "@/components/main-layout";
import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDuration } from "@/lib/utils";
import Pagination from "@/components/pagination";
import TimeLogStart from "@/components/time-log-start";
import TimeLogEnd from "@/components/time-log-end";
import CountUp from "@/components/count-up";
import { getCurrentUser, getTimeLogs } from "@/lib/apiServer";

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
  const timeLogs = await getTimeLogs(page);
  const currentUser = await getCurrentUser();

  return (
    <MainLayout currentUser={currentUser} active="time-logs">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Time Logs</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Activity</TableHead>
          </TableRow>
        </TableHeader>
        {timeLogs?.items.length ? (
          <TableBody>
            {timeLogs.items.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="whitespace-nowrap">
                  {i.user__username}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <TimeLogStart start={i.start} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <TimeLogEnd end={i.end} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {i.end ? (
                    getDuration(new Date(i.start), new Date(i.end))
                  ) : (
                    <CountUp date={new Date(i.start)} title="" />
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {i.project__name}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {i.activity__name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow className="text-center h-40 hover:bg-transparent text-muted-foreground">
              <TableCell colSpan={7}>No time logs found.</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
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
