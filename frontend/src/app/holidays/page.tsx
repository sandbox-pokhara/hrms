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
import { format } from "date-fns";
import Pagination from "@/components/pagination";
import { getCurrentUser, getHolidays } from "@/lib/apiServer";

export const metadata: Metadata = {
  title: "Holidays - Sandbox HRMS",
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
  const holidays = await getHolidays(page);
  const currentUser = await getCurrentUser();

  return (
    <MainLayout currentUser={currentUser} active="holidays">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Holidays</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        {holidays ? (
          <TableBody>
            {holidays.items.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="whitespace-nowrap">{i.name}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(i.date, "yyyy/MM/dd")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No holidays found.
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Pagination
        pageIndex={page}
        totalPages={
          holidays?.items.length !== 0
            ? Math.ceil((holidays?.count || 1) / 10)
            : 0
        }
      />
    </MainLayout>
  );
}
