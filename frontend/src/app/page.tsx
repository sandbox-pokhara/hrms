import MainLayout from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, getWorkingTimeSummary } from "@/lib/apiServer";
import { convertHoursToHHMM } from "@/lib/utils";
import { Hourglass } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const DynamicChart = dynamic(() => import("@/components/chart"), {
  ssr: false,
});

export default async function Dashboard() {
  const currentUser = await getCurrentUser();
  const data = await getWorkingTimeSummary();

  if (!data) {
    return null;
  }

  return (
    <MainLayout currentUser={currentUser} active={"dashboard"}>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col w-full max-w-full h-[350px]">
          <Suspense fallback={<div>Loading...</div>}>
            <DynamicChart data={data?.working_hours_graph || []} />
          </Suspense>
        </div>
        <div className="flex gap-4">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pt-4 pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Working Hours Today
              </CardTitle>
              <Hourglass className="text-lg text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">
                {convertHoursToHHMM(data.working_hours_today)}
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pt-4 pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Working Hours This Week
              </CardTitle>
              <Hourglass className="text-lg text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">
                {convertHoursToHHMM(data.working_hours_this_week)}
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pt-4 pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Working Hours This Month
              </CardTitle>
              <Hourglass className="text-lg text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">
                {convertHoursToHHMM(data.working_hours_this_month)}
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pt-4 pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Working Hours This Year
              </CardTitle>
              <Hourglass className="text-lg text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">
                {convertHoursToHHMM(data.working_hours_this_year)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
