"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  totalPages: number;
  pageIndex: number;
}

export default function Pagination({ totalPages, pageIndex }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handleNavigation = (pageNumber: number) => {
    const url = createPageURL(pageNumber);
    router.push(url);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mt-1 whitespace-nowrap sm:flex-nowrap">
      <span className="mt-4 text-sm text-muted-foreground">
        Page {pageIndex} out of {totalPages}
      </span>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 sm:flex-nowrap">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            onClick={() => handleNavigation(1)}
            disabled={pageIndex === 1}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => handleNavigation(pageIndex - 1)}
            disabled={pageIndex <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => {
              handleNavigation(pageIndex + 1);
            }}
            disabled={!(totalPages - pageIndex)}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            onClick={() => handleNavigation(totalPages)}
            disabled={!(totalPages - pageIndex)}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
