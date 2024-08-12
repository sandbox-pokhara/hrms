import { Button } from "@/components/ui/button";
import { addDays, addMonths, format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  dateType: string;
  startDate: Date;
  endDate: Date;
  showDifference: boolean;
}

const calculateTimeRange = (
  dateType: string,
  startDate: Date,
  endDate: Date,
  isNext: boolean
) => {
  const offset = isNext ? 1 : -1;
  const adjust = dateType === "weekly" ? addDays : addMonths;
  return {
    start: format(
      adjust(startDate, offset * (dateType === "weekly" ? 7 : 1)),
      "yyyy-MM-dd"
    ),
    end: format(
      adjust(endDate, offset * (dateType === "weekly" ? 7 : 1)),
      "yyyy-MM-dd"
    ),
  };
};

export default function DateFilter({
  dateType,
  startDate,
  endDate,
  showDifference,
}: Props) {
  const prevTime = calculateTimeRange(dateType, startDate, endDate, false);
  const nextTime = calculateTimeRange(dateType, startDate, endDate, true);

  return (
    <div className="inline-flex gap-1 items-center">
      <Button asChild variant="outline" disabled={false} size="sm">
        <Link
          href={`?start=${prevTime.start}&end=${prevTime.end}&date-type=${dateType}&show-difference=${showDifference}`}
          className="px-1"
        >
          <span className="sr-only">Go to last page</span>
          <ChevronLeftIcon className="w-4 h-full" />
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link
          href={`?date-type=${
            dateType === "weekly" ? "monthly" : "weekly"
          }&show-difference=${showDifference}`}
          aria-label="Toggle date type"
          className="w-[70px]"
        >
          {dateType === "weekly" ? "Weekly" : "Monthly"}
        </Link>
      </Button>
      <Button asChild size="sm" variant="outline" disabled={false}>
        <Link
          href={`?start=${nextTime.start}&end=${nextTime.end}&date-type=${dateType}&show-difference=${showDifference}`}
          className="px-1"
        >
          <span className="sr-only">Go to last page</span>
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
