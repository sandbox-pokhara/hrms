import MainLayout from "@/components/main-layout";
import PageUnderConstruction from "@/components/page-under-construction";
import { getCurrentUser } from "@/lib/apiServer";

export default async function Dashboard() {
  const currentUser = await getCurrentUser();
  return (
    <MainLayout currentUser={currentUser} active={"dashboard"}>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <PageUnderConstruction />
    </MainLayout>
  );
}
