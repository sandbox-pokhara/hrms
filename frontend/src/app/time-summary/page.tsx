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
import TimeLogStart from "@/components/time-log-start";
import { getCurrentUser, getTimeSummary } from "@/lib/apiServer";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { format, subDays } from "date-fns";

export const metadata: Metadata = {
  title: "Time Summary - Sandbox HRMS",
  description: "Human Resource Management System",
};

export default async function TimeSummary({
  searchParams,
}: {
  searchParams?: {
    start?: string;
    end?: string;
  };
}) {
  const start =
    searchParams?.start || format(subDays(new Date(), 6), "yyyy-MM-dd");
  const end = searchParams?.end || format(new Date(), "yyyy-MM-dd");

  const timeSummary = await getTimeSummary(start, end);
  const currentUser = await getCurrentUser();

  return (
    <MainLayout currentUser={currentUser} active="time-summary">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Time Summary</h1>
      </div>
      <div className="ml-auto">
        <DatePickerWithRange initialFrom={start} initialTo={end} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Expected Hour</TableHead>
            <TableHead>Hours Worked</TableHead>
            <TableHead>Weekday</TableHead>
            <TableHead>Holiday</TableHead>
          </TableRow>
        </TableHeader>
        {timeSummary?.length ? (
          <TableBody>
            {timeSummary?.map((userSummary) =>
              userSummary?.summary.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{userSummary.user}</TableCell>
                  <TableCell>
                    <TimeLogStart start={item.date} />
                  </TableCell>
                  <TableCell>{item.expected_hours}</TableCell>
                  <TableCell>{item.hours_worked.toFixed(2)}</TableCell>
                  <TableCell>{item.weekday}</TableCell>
                  <TableCell>{item.holiday || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No time summary data found.
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </MainLayout>
  );
}
