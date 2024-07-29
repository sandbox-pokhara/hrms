import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface Props {
  message: string;
  colSpan: number;
}

export default function TableEmptyState({ message, colSpan }: Props) {
  return (
    <TableBody>
      <TableRow className="text-center h-40 hover:bg-transparent text-muted-foreground">
        <TableCell colSpan={colSpan}>{message}</TableCell>
      </TableRow>
    </TableBody>
  );
}
