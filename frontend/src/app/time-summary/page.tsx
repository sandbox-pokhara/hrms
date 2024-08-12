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
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { cn, convertHoursToHHMM } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { components } from "@/lib/schema";
import DateFilter from "./_components/date-filter";

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
    "show-difference"?: string;
    "date-type"?: "weekly" | "monthly";
  };
}) {
  const today = new Date();
  const dateType = searchParams?.["date-type"]?.toLowerCase() || "weekly";
  const start = searchParams?.start
    ? new Date(searchParams.start)
    : dateType === "weekly"
    ? startOfWeek(today, { weekStartsOn: 0 })
    : startOfMonth(today);
  const end = searchParams?.end
    ? new Date(searchParams.end)
    : dateType === "weekly"
    ? endOfWeek(today, { weekStartsOn: 0 })
    : endOfMonth(today);
  const showDifference = searchParams?.["show-difference"] === "true";

  const formattedStart = format(start, "yyyy-MM-dd");
  const formattedEnd = format(end, "yyyy-MM-dd");

  const timeSummary = await getTimeSummary(formattedStart, formattedEnd);
  const currentUser = await getCurrentUser();
  const dateRange = eachDayOfInterval({ start, end });

  const totalWorkingHours: IWorkingHours | undefined =
    timeSummary?.reduce<IWorkingHours>(
      (acc, user) => {
        user.summary.forEach((day) => {
          if (day?.holiday || day?.absence) return acc.total;
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
        <div className="inline-flex gap-3 items-center">
          <DateFilter
            dateType={dateType}
            startDate={start}
            endDate={end}
            showDifference={showDifference}
          />
          <Button
            size="sm"
            variant={showDifference ? "secondary" : "outline"}
            asChild
          >
            <Link
              href={`/time-summary/?start=${formattedStart}&end=${formattedEnd}&show-difference=${!showDifference}`}
            >
              Show Difference
            </Link>
          </Button>
        </div>
      </div>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="w-[100px]">Total</TableHead>
              {dateRange.map((date) => (
                <TableHead
                  key={date.toISOString()}
                  className={cn("w-[100px] whitespace-nowrap", {
                    "bg-muted": isSameDay(new Date(), date),
                  })}
                >
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
                    (acc, item) => {
                      if (item?.holiday || item?.absence) return acc;
                      return item.hours_worked + acc;
                    },
                    0
                  );
                  const userExpectedHours = userSummary.summary.reduce(
                    (acc, item) => {
                      if (
                        new Date(item.date) > new Date() ||
                        item.holiday.length ||
                        item.absence.length
                      )
                        return acc;
                      return item.expected_hours + acc;
                    },
                    0
                  );
                  const totalDifference =
                    userTotalHoursWorked - userExpectedHours;

                  return (
                    <TableRow key={userSummary.user}>
                      <TableCell className="w-[200px] whitespace-nowrap">
                        {userSummary.user}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-medium w-[120px] whitespace-nowrap",
                          showDifference
                            ? totalDifference >= 0
                              ? "text-green-600"
                              : "text-red-600"
                            : "text-blue-600"
                        )}
                      >
                        {showDifference
                          ? totalDifference >= 0
                            ? "+"
                            : "-"
                          : null}
                        {convertHoursToHHMM(
                          showDifference
                            ? Math.abs(totalDifference)
                            : userTotalHoursWorked
                        )}
                      </TableCell>
                      {dateRange.map((date) => {
                        const dayData:
                          | components["schemas"]["TimeLogSummaryPerDay"]
                          | undefined = userSummary.summary.find(
                          (item) => item.date === format(date, "yyyy-MM-dd")
                        );
                        if (!dayData || new Date(dayData?.date) > new Date())
                          return null;

                        const difference =
                          (dayData?.hours_worked || 0) -
                          (dayData?.expected_hours || 0);

                        const sign =
                          showDifference &&
                          !dayData?.holiday &&
                          !dayData?.absence
                            ? new Intl.NumberFormat("en-US", {
                                signDisplay: "exceptZero",
                              }).format(difference)[0]
                            : null;

                        return (
                          <TableCell
                            key={date.toISOString()}
                            className={cn("whitespace-nowrap", {
                              "bg-muted":
                                dayData?.holiday.length ||
                                dayData?.absence?.length,
                              "text-green-600":
                                showDifference && difference >= 0,
                              "text-red-600": showDifference && difference < 0,
                            })}
                          >
                            {sign}
                            {dayData?.holiday || dayData?.absence
                              ? ""
                              : showDifference
                              ? convertHoursToHHMM(Math.abs(difference))
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
                  <TableCell className="whitespace-nowrap">
                    Total Working Hours
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {convertHoursToHHMM(totalWorkingHours?.total || 0)}
                  </TableCell>
                  {dateRange.map((date) => {
                    const totalHours =
                      totalWorkingHours?.[format(date, "yyyy-MM-dd")] || 0;
                    return (
                      <TableCell
                        key={date.toISOString()}
                        className="whitespace-nowrap"
                      >
                        {convertHoursToHHMM(totalHours)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </>
            ) : (
              <TableRow className="text-center h-40 hover:bg-transparent text-muted-foreground">
                <TableCell colSpan={9} className="text-center">
                  No time summary data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
}
