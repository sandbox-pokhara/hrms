import MainLayout from "@/components/main-layout";
import SummaryCard from "@/components/SummaryCard";
import { getCurrentUser, getWorkingTimeSummary } from "@/lib/apiServer";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { subDays, format } from "date-fns";

const DynamicChart = dynamic(() => import("@/components/chart"), {
  ssr: false,
});

export default async function Dashboard() {
  const currentUser = await getCurrentUser();
  const data = await getWorkingTimeSummary(
    format(subDays(new Date(), 7), "yyyy-MM-dd")
  );

  if (!data) {
    return null;
  }

  return (
    <MainLayout currentUser={currentUser} active={"dashboard"}>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col w-full max-w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <DynamicChart
              data={data?.working_hours_graph || []}
              hours_worked_today={data?.working_hours_today}
            />
          </Suspense>
        </div>
        <div className="flex gap-4 flex-wrap">
          <SummaryCard
            hoursWorked={data?.working_hours_today}
            title={"Hours Worked Today"}
            description={`Today, you have worked ${data?.working_hours_today.toFixed(
              2
            )} hours.`}
            metric="hours"
          />
          <SummaryCard
            hoursWorked={data?.working_hours_this_week}
            title={"Hours Worked This Week"}
            description={`Over the last 7 days, you have worked ${data?.working_hours_this_week.toFixed(
              2
            )} hours.`}
            metric="hours/week"
          />
          <SummaryCard
            hoursWorked={data?.working_hours_this_month}
            title={"Hours Worked This Month"}
            description={`Over the last 30 days, you have worked ${data?.working_hours_this_month.toFixed(
              2
            )} hours.`}
            metric="hours/month"
          />
          <SummaryCard
            hoursWorked={data?.working_hours_this_year}
            title={"Hours Worked This Year"}
            description={`Over the last 365 days, you have worked ${data?.working_hours_this_year.toFixed(
              2
            )} hours.`}
            metric="hours/year"
          />
        </div>
      </div>
    </MainLayout>
  );
}
