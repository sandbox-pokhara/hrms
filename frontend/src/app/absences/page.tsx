import MainLayout from "@/components/main-layout";
import Pagination from "@/components/pagination";
import { SubmitAbsence } from "@/components/submit-absence";
import TableEmptyState from "@/components/table-empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAbsenceBalances,
  getCurrentUser,
  getRemaningAbsences,
} from "@/lib/apiServer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Absences - Sandbox HRMS",
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
  const currentUser = await getCurrentUser();
  const absenceBalances = await getAbsenceBalances(page);
  const remainingAbsences = await getRemaningAbsences();
  return (
    <MainLayout currentUser={currentUser} active="absences">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Absences</h1>
        <div className="ml-auto flex gap-4 items-center">
          <span className="whitespace-nowrap">
            Reamining: {remainingAbsences.value}
          </span>
          <SubmitAbsence remainigAbsences={remainingAbsences?.value} />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Delta</TableHead>
            <TableHead className="whitespace-nowrap">Created By</TableHead>
          </TableRow>
        </TableHeader>
        {absenceBalances?.items.length ? (
          <TableBody>
            {absenceBalances?.items.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="whitespace-nowrap">
                  {i.user__username}
                </TableCell>
                <TableCell className="whitespace-nowrap">{i.date}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {i.description}
                </TableCell>
                <TableCell className="whitespace-nowrap">{i.delta}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {i.created_by__username}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableEmptyState colSpan={5} message="No absences found." />
        )}
      </Table>
      <Pagination
        pageIndex={page}
        totalPages={
          absenceBalances?.items.length !== 0
            ? Math.ceil((absenceBalances?.count || 1) / 10)
            : 1
        }
        path="/absences/"
      />
    </MainLayout>
  );
}
