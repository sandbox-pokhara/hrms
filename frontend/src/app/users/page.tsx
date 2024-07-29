import { CreateUser } from "@/components/create-user";
import MainLayout from "@/components/main-layout";
import { getCurrentUser, getUsersList } from "@/lib/apiServer";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/pagination";

export default async function Users({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.is_superuser) redirect("/login/");
  const page = parseInt(searchParams?.page || "1");
  const users = await getUsersList(page);

  return (
    <MainLayout currentUser={currentUser} active={"users"}>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
        <CreateUser />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="whitespace-nowrap">
              Expected Hours Sun
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Expected Hours Mon
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Expected Hours Tues
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Expected Hours Wed
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Expected Hours Thu
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Expected Hours Fri
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Expected Hours Sat
            </TableHead>
          </TableRow>
        </TableHeader>
        {users ? (
          <TableBody>
            {users.items.map((i) => (
              <TableRow key={i.id}>
                <TableCell>{i.username}</TableCell>
                <TableCell>{i.expected_hours_sun}</TableCell>
                <TableCell>{i.expected_hours_mon}</TableCell>
                <TableCell>{i.expected_hours_tue}</TableCell>
                <TableCell>{i.expected_hours_wed}</TableCell>
                <TableCell>{i.expected_hours_thu}</TableCell>
                <TableCell>{i.expected_hours_fri}</TableCell>
                <TableCell>{i.expected_hours_sat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow className="text-center h-40 hover:bg-none text-muted-foreground">
              <TableCell colSpan={7}>No users found.</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Pagination
        pageIndex={page}
        totalPages={
          users?.items.length !== 0 ? Math.ceil((users?.count || 1) / 10) : 1
        }
        path="/users/"
      />
    </MainLayout>
  );
}
