import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  totalPages: number;
  pageIndex: number;
  path: string;
}

export default function Pagination({ totalPages, pageIndex, path }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mt-1 whitespace-nowrap sm:flex-nowrap">
      <span className="mt-4 text-sm text-muted-foreground">
        Page {pageIndex} out of {totalPages}
      </span>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 sm:flex-nowrap">
        <div className="flex items-center space-x-2">
          <Button
            asChild
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            disabled={pageIndex === 1}
          >
            <Link href={`${path}?page=1`}>
              <span className="sr-only">Go to last page</span>
              <DoubleArrowLeftIcon className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-8 h-8 p-0"
            disabled={pageIndex <= 1}
          >
            <Link href={`${path}?page=${pageIndex - 1}`}>
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-8 h-8 p-0"
            disabled={!(totalPages - pageIndex)}
          >
            <Link href={`${path}?page=${pageIndex + 1}`}>
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            disabled={!(totalPages - pageIndex)}
          >
            <Link href={`${path}?page=${totalPages}`}>
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
