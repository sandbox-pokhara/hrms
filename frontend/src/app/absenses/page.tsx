import MainLayout from "@/components/main-layout";
import Pagination from "@/components/pagination";
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
  title: "Absenses - Sandbox HRMS",
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
    <MainLayout currentUser={currentUser} active="absenses">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Absenses</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Delta</TableHead>
            <TableHead>Created By</TableHead>
          </TableRow>
        </TableHeader>
        {absenceBalances?.items.length ? (
          <TableBody>
            {absenceBalances?.items.map((i) => (
              <TableRow key={i.id}>
                <TableCell>{i.user__username}</TableCell>
                <TableCell>{i.date}</TableCell>
                <TableCell>{i.description}</TableCell>
                <TableCell>{i.delta}</TableCell>
                <TableCell>{i.created_by__username}</TableCell>
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
          absenceBalances?.items.length !== 0
            ? Math.ceil((absenceBalances?.count || 1) / 10)
            : 1
        }
        path="/absenses/"
      />
      Reamining: {remainingAbsences.value}
    </MainLayout>
  );
}
