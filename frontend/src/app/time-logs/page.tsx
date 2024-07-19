import MainLayout from "@/components/main-layout";
import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Time Logs - Sandbox HRMS",
  description: "Human Resource Management System",
};

const data = [
  {
    id: "1",
    start: "Jul 19 23:46",
    end: "Jul 19 23:46",
    duration: "10h55m",
    project: "Project L",
    activity: "System Administration",
  },
  {
    id: "1",
    start: "Jul 19 23:46",
    end: "Jul 19 23:46",
    duration: "10h55m",
    project: "Project L",
    activity: "System Administration",
  },
  {
    id: "1",
    start: "Jul 19 23:46",
    end: "Jul 19 23:46",
    duration: "10h55m",
    project: "Project L",
    activity: "System Administration",
  },

  {
    id: "1",
    start: "Jul 19 23:46",
    end: "Jul 19 23:46",
    duration: "10h55m",
    project: "Project L",
    activity: "System Administration",
  },
  {
    id: "1",
    start: "Jul 19 23:46",
    end: "Jul 19 23:46",
    duration: "10h55m",
    project: "Project L",
    activity: "System Administration",
  },
];

export default function TimeLogs() {
  return (
    <MainLayout active="time-logs">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Time Logs</h1>
      </div>
      <Table>
        <TableCaption>Showing 7 out of 300.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.start}</TableCell>
              <TableCell>{invoice.end}</TableCell>
              <TableCell>{invoice.duration}</TableCell>
              <TableCell>{invoice.project}</TableCell>
              <TableCell>{invoice.activity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainLayout>
  );
}
