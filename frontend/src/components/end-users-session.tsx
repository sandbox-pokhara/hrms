import { getCookie } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { components } from "@/lib/schema";

interface Props {
  username: string;
  currentUser: components["schemas"]["UserDTO"];
}

export default function EndUsersSession({ username, currentUser }: Props) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-xs px-2 h-5"
      onClick={async () => {
        const csrftoken = getCookie("csrftoken");
        if (!csrftoken) return false;
        const res = await fetch(
          currentUser?.is_superuser
            ? `/api/time-logs/${username}/end/`
            : "/api/time-logs/end/",
          {
            method: "POST",
            headers: {
              "X-CSRFToken": csrftoken,
            },
          }
        );
        document.title = "Time Logs - Sandbox HRMS";
        router.refresh();
      }}
    >
      End Session
    </Button>
  );
}
