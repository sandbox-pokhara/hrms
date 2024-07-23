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
import { getCurrentUser, getTimeSummary } from "@/lib/apiServer";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { cn, convertHoursToHHMM } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Time Summary - Sandbox HRMS",
  description: "Human Resource Management System",
};

interface IWorkingHours {
  total: number;
  [date: string]: number;
}

export default async function TimeSummary({
  searchParams,
}: {
  searchParams?: {
    start?: string;
    end?: string;
    toggle?: boolean;
  };
}) {
  const today = new Date();
  const start = searchParams?.start
    ? new Date(searchParams.start)
    : startOfWeek(today, { weekStartsOn: 0 });
  const end = searchParams?.end
    ? new Date(searchParams.end)
    : endOfWeek(today, { weekStartsOn: 0 });
  const toggle = searchParams?.toggle || false;

  const formattedStart = format(start, "yyyy-MM-dd");
  const formattedEnd = format(end, "yyyy-MM-dd");

  const timeSummary = await getTimeSummary(formattedStart, formattedEnd);
  const currentUser = await getCurrentUser();
  const dateRange = eachDayOfInterval({ start, end });

  const totalWorkingHours: IWorkingHours | undefined =
    timeSummary?.reduce<IWorkingHours>(
      (acc, user) => {
        user.summary.forEach((day) => {
          if (!acc[day?.date]) {
            acc[day?.date] = 0;
          }
          acc[day?.date] += day.hours_worked;
          acc.total += day.hours_worked;
        });
        return acc;
      },
      { total: 0 }
    );

  return (
    <MainLayout currentUser={currentUser} active="time-summary">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Time Summary</h1>
        <Button variant="outline" asChild>
          <Link
            href={
              toggle
                ? "/time-summary/?toggle=false"
                : "/time-summary/?toggle=true"
            }
          >
            Show Difference
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Total</TableHead>
            {dateRange.map((date) => (
              <TableHead key={date.toISOString()}>
                {format(date, "EEE dd")}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeSummary?.length ? (
            <>
              {timeSummary.map((userSummary) => {
                const userTotalHoursWorked = userSummary.summary.reduce(
                  (acc, item) => item.hours_worked + acc,
                  0
                );
                const userExpectedHours = userSummary.summary.reduce(
                  (acc, item) => {
                    if (new Date(item.date) > new Date() || item.holiday.length)
                      return acc;
                    return item.expected_hours + acc;
                  },
                  0
                );

                return (
                  <TableRow key={userSummary.user}>
                    <TableCell>{userSummary.user}</TableCell>
                    <TableCell
                      className={cn(
                        "font-medium",
                        toggle
                          ? userTotalHoursWorked - userExpectedHours >= 0
                            ? "text-green-600"
                            : "text-red-600"
                          : "text-blue-600"
                      )}
                    >
                      {toggle &&
                        userTotalHoursWorked - userExpectedHours >= 0 &&
                        "+"}
                      {convertHoursToHHMM(
                        toggle
                          ? userTotalHoursWorked - userExpectedHours
                          : userTotalHoursWorked
                      )}
                    </TableCell>
                    {dateRange.map((date) => {
                      const dayData = userSummary.summary.find(
                        (item) => item.date === format(date, "yyyy-MM-dd")
                      );
                      return (
                        <TableCell
                          key={date.toISOString()}
                          className={cn({
                            "bg-muted":
                              dayData?.weekday === "sat" ||
                              dayData?.holiday.length,
                            "text-green-600":
                              toggle &&
                              (dayData?.hours_worked || 0) -
                                (dayData?.expected_hours || 0) >=
                                0,
                            "text-red-600":
                              toggle &&
                              (dayData?.hours_worked || 0) -
                                (dayData?.expected_hours || 0) <
                                0,
                          })}
                        >
                          {toggle &&
                            !dayData?.weekday &&
                            (dayData?.hours_worked || 0) -
                              (dayData?.expected_hours || 0) >=
                              0 &&
                            "+"}
                          {dayData?.holiday
                            ? ""
                            : toggle
                            ? convertHoursToHHMM(
                                (dayData?.hours_worked || 0) -
                                  (dayData?.expected_hours || 0)
                              )
                            : dayData?.hours_worked
                            ? convertHoursToHHMM(dayData?.hours_worked)
                            : ""}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              <TableRow className="bg-muted font-medium">
                <TableCell>Total Working Hours</TableCell>
                <TableCell>
                  {convertHoursToHHMM(totalWorkingHours?.total || 0)}
                </TableCell>
                {dateRange.map((date) => {
                  const totalHours =
                    totalWorkingHours?.[format(date, "yyyy-MM-dd")] || 0;
                  return (
                    <TableCell key={date.toISOString()}>
                      {convertHoursToHHMM(totalHours)}
                    </TableCell>
                  );
                })}
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                No time summary data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </MainLayout>
  );
}
