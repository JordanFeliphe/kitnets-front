import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Payment } from "@/interfaces/payments/payments";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Props {
  data: Payment[];
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
  onShowHistory?: (payment: Payment) => void;
}

export function PaymentTable({
  data,
  onEdit,
  onDelete,
  onShowHistory,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className="grid gap-4">
        {data.map((payment) => (
          <Card key={payment.id} className="border border-solid border-border rounded-md">
            <CardContent className="p-4 space-y-2 text-sm">
              <div><strong>Morador:</strong> {payment.residentName}</div>
              <div><strong>Valor Pago:</strong> {payment.amount}</div>
              <div><strong>Data de Pagamento:</strong> {payment.paymentDate}</div>
              <div><strong>Forma de Pagamento:</strong> {payment.paymentMethod}</div>
              <div>
                <strong>Status:</strong>{" "}
                <Badge variant={payment.status === "Paid" ? "statusActive" : "warningAlt"}>
                  {payment.status === "Paid" ? "Pago" : "Pendente"}
                </Badge>
              </div>
              <div className="pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">Ações</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(payment)}>
                      <Pencil className="w-4 h-4 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete?.(payment)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2 text-red-600" /> Excluir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShowHistory?.(payment)}>
                      <Clock className="w-4 h-4 mr-2" /> Detalhes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-solid border-border overflow-hidden">
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="border-b border-solid border-border">
            <TableHead className="border-r border-solid border-border">ID do Pagamento</TableHead>
            <TableHead className="border-r border-solid border-border">Morador</TableHead>
            <TableHead className="border-r border-solid border-border">Valor Pago</TableHead>
            <TableHead className="border-r border-solid border-border">Data de Pagamento</TableHead>
            <TableHead className="border-r border-solid border-border">Forma de Pagamento</TableHead>
            <TableHead className="border-r border-solid border-border">Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((payment) => (
            <TableRow key={payment.id} className="border-b border-solid border-border">
              <TableCell className="border-r border-solid border-border">{payment.id}</TableCell>
              <TableCell className="border-r border-solid border-border">{payment.residentName}</TableCell>
              <TableCell className="border-r border-solid border-border">{payment.amount}</TableCell>
              <TableCell className="border-r border-solid border-border">{payment.paymentDate}</TableCell>
              <TableCell className="border-r border-solid border-border">{payment.paymentMethod}</TableCell>
              <TableCell className="border-r border-solid border-border">
                <Badge variant={payment.status === "Paid" ? "statusActive" : "warningAlt"}>
                  {payment.status === "Paid" ? "Pago" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(payment)}>
                      <Pencil className="w-4 h-4 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete?.(payment)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2 text-red-600" /> Excluir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShowHistory?.(payment)}>
                      <Clock className="w-4 h-4 mr-2" /> Detalhes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
