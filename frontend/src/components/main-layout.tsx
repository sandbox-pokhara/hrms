import Link from "next/link";
import {
  BarChartHorizontal,
  CalendarCheck2,
  CalendarX2,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  UserRoundX,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProfileDropdown from "./profile-dropdown";
import TimeLogCard from "./time-log-card";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_HOST } from "@/lib/constants";
const activeLink =
  "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary";
const inactiveLink =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";

async function getCurrentTimeLog() {
  const cookieStore = cookies();
  const sessionid = cookieStore.get("sessionid");
  if (!sessionid) redirect("/login/");
  try {
    const res = await fetch(`${API_HOST}/api/time-logs/current/`, {
      headers: {
        Cookie: `sessionid=${sessionid.value}`,
      },
    });
    if (res.status === 401) redirect("/login/");
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function MainLayout({
  active,
  children,
}: Readonly<{
  active: "dashboard" | "time-logs" | "time-summary" | "holidays" | "absenses";
  children: React.ReactNode;
}>) {
  const currentTimeLog = await getCurrentTimeLog();
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Sandbox HRMS</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/"
                className={active === "dashboard" ? activeLink : inactiveLink}
              >
                <LineChart className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/time-logs"
                className={active === "time-logs" ? activeLink : inactiveLink}
              >
                <CalendarCheck2 className="h-4 w-4" />
                Time Logs
              </Link>
              <Link
                href="/time-summary"
                className={
                  active === "time-summary" ? activeLink : inactiveLink
                }
              >
                <BarChartHorizontal className="h-4 w-4" />
                Time Summary{" "}
              </Link>
              <Link
                href="/holidays"
                className={active === "holidays" ? activeLink : inactiveLink}
              >
                <CalendarX2 className="h-4 w-4" />
                Holidays
              </Link>
              <Link
                href="/absenses"
                className={active === "absenses" ? activeLink : inactiveLink}
              >
                <UserRoundX className="h-4 w-4" />
                Absenses
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <TimeLogCard initial={currentTimeLog} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <ProfileDropdown />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
