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
import { cookies } from "next/headers";
import { components } from "@/lib/schema";
import { redirect } from "next/navigation";
import { API_HOST } from "@/lib/constants";
import Pagination from "@/components/pagination";
import TimeLogStart from "@/components/time-log-start";
import TimeLogEnd from "@/components/time-log-end";
import CountUp from "@/components/count-up";

export const metadata: Metadata = {
  title: "Time Logs - Sandbox HRMS",
  description: "Human Resource Management System",
};

async function getTimeLogs(
  page: number = 1,
  limit: number = 10
): Promise<components["schemas"]["PagedTimeLogDTO"] | null> {
  const cookieStore = cookies();
  const sessionid = cookieStore.get("sessionid");
  if (!sessionid) redirect("/login/");
  try {
    const res = await fetch(
      `${API_HOST}/api/time-logs/?limit=${limit}&offset=${(page - 1) * limit}`,
      {
        headers: {
          Cookie: `sessionid=${sessionid.value}`,
        },
      }
    );
    if (res.status === 401) redirect("/login/");
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function TimeLogs({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const page = parseInt(searchParams?.page || "1");
  const timeLogs = await getTimeLogs(page);
  return (
    <MainLayout active="time-logs">
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
        {timeLogs ? (
          <TableBody>
            {timeLogs.items.map((i) => (
              <TableRow key={i.id}>
                <TableCell>{i.user__username}</TableCell>
                <TableCell>
                  <TimeLogStart start={i.start} />
                </TableCell>
                <TableCell>
                  <TimeLogEnd end={i.end} />
                </TableCell>
                <TableCell>
                  {i.end ? (
                    getDuration(new Date(i.start), new Date(i.end))
                  ) : (
                    <CountUp date={new Date(i.start)} />
                  )}
                </TableCell>
                <TableCell>{i.project__name}</TableCell>
                <TableCell>{i.activity__name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No time logs found.
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Pagination
        pageIndex={page}
        totalPages={
          timeLogs?.items.length !== 0
            ? Math.ceil((timeLogs?.count || 1) / 10)
            : 0
        }
      />
    </MainLayout>
  );
}
