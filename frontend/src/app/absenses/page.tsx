import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Absenses - Sandbox HRMS",
  description: "Human Resource Management System",
};

export default function TimeLogs() {
  return (
    <MainLayout active="absenses">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Absenses</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Page under construction
          </h3>
          <p className="text-sm text-muted-foreground">
            You can start by adding time logs.
          </p>
          <Button className="mt-4">Go to Time Logs</Button>
        </div>
      </div>
    </MainLayout>
  );
}
