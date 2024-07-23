import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_HOST } from "./constants";
import { components } from "./schema";

function isRedirectError(err: any) {
  return (
    err &&
    typeof err === "object" &&
    "digest" in err &&
    typeof err.digest === "string" &&
    err.digest.startsWith("NEXT_REDIRECT")
  );
}

export async function serverFetch(url: string, init?: RequestInit) {
  const cookieStore = cookies();
  const sessionid = cookieStore.get("sessionid");
  if (sessionid) {
    if (!init) init = {};
    init.headers = { ...init.headers, Cookie: `sessionid=${sessionid.value}` };
  }
  const res = await fetch(`${API_HOST}${url}`, init);
  if (res.status === 401) redirect("/login/");
  return res;
}

export async function getCurrentTimeLog(): Promise<
  components["schemas"]["TimeLogDTO"] | null
> {
  try {
    const res = await serverFetch("/api/time-logs/current/");
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.log(err);
    return null;
  }
}

export async function getProjects(): Promise<
  components["schemas"]["PagedProjectDTO"]
> {
  try {
    const res = await serverFetch("/api/projects/");
    if (!res.ok) return { count: 0, items: [] };
    return await res.json();
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.log(err);
    return { count: 0, items: [] };
  }
}

export async function getActivities(): Promise<
  components["schemas"]["PagedActivityDTO"]
> {
  try {
    const res = await serverFetch("/api/activities/");
    if (!res.ok) return { count: 0, items: [] };
    return await res.json();
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.log(err);
    return { count: 0, items: [] };
  }
}

export async function getCurrentUser(): Promise<
  components["schemas"]["UserDTO"]
> {
  try {
    const res = await serverFetch("/api/users/current/");
    if (!res.ok) redirect("/login/");
    return await res.json();
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.log(err);
    redirect("/login/");
  }
}

export async function getHolidays(
  page: number = 1,
  limit: number = 10
): Promise<components["schemas"]["PagedHolidayDTO"]> {
  try {
    const res = await serverFetch(
      `/api/holidays/?limit=${limit}&offset=${(page - 1) * limit}`
    );
    if (!res.ok) return { count: 0, items: [] };
    return await res.json();
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.log(err);
    return { count: 0, items: [] };
  }
}

export async function getTimeLogs(
  page: number = 1,
  limit: number = 10
): Promise<components["schemas"]["PagedTimeLogDTO"]> {
  try {
    const res = await serverFetch(
      `/api/time-logs/?limit=${limit}&offset=${(page - 1) * limit}`
    );
    if (!res.ok) return { count: 0, items: [] };
    return await res.json();
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.log(err);
    return { count: 0, items: [] };
  }
}

export async function getAbsenceBalances(
  page: number = 1,
  limit: number = 10
): Promise<components["schemas"]["PagedAbsenceBalanceDTO"]> {
  try {
    const res = await serverFetch(
      `/api/absence-balances/?limit=${limit}&offset=${(page - 1) * limit}`
    );
    if (!res.ok) return { count: 0, items: [] };
    return await res.json();
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.log(err);
    return { count: 0, items: [] };
  }
}

export async function getRemaningAbsences(): Promise<
  components["schemas"]["RemainingAbsences"]
> {
  try {
    const res = await serverFetch("/api/absence-balances/remaining/");
    if (!res.ok) return { value: 0 };
    return await res.json();
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.log(err);
    return { value: 0 };
  }
}

export async function getTimeSummary(
  start: string,
  end: string
): Promise<components["schemas"]["TimeLogSummaryDTO"][] | null> {
  try {
    const res = await serverFetch(
      `/api/time-logs/summary/?start=${start}&end=${end}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.log(err);
    return null;
  }
}
