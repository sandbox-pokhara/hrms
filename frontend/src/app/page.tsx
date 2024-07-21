import MainLayout from "@/components/main-layout";
import PageUnderConstruction from "@/components/page-under-construction";

export default function Dashboard() {
  return (
    <MainLayout active={"dashboard"}>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <PageUnderConstruction />
    </MainLayout>
  );
}
