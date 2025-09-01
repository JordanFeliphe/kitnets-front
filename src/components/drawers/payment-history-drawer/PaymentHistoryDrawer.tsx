import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Resident } from "@/interfaces/resident/resident";
import { format } from "date-fns";

interface Payment {
  id: string;
  dueDate: string;
  paymentDate?: string;
  amount: string;
  status: "Pago" | "Pendente" | "Vencido";
  method?: string;
  reference?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resident: Resident | null;
}

export function PaymentHistoryDrawer({ open, onOpenChange, resident }: Props) {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (resident) {
      setPayments([
        {
          id: "1",
          dueDate: "2024-01-10",
          paymentDate: "2024-01-10",
          amount: "900.00",
          status: "Pago",
          method: "PIX",
          reference: "REF123456",
        },
        {
          id: "2",
          dueDate: "2024-02-10",
          paymentDate: "2024-02-09",
          amount: "900.00",
          status: "Pago",
          method: "Boleto",
          reference: "REF654321",
        },
        {
          id: "3",
          dueDate: "2024-03-10",
          amount: "900.00",
          status: "Pendente",
        },
        {
          id: "4",
          dueDate: "2024-04-10",
          amount: "900.00",
          status: "Vencido",
        },
      ]);
    }
  }, [resident]);

  const statusColor = {
    Pago: "bg-green-700 text-white",
    Pendente: "bg-yellow-700 text-white",
    Vencido: "bg-red-700 text-white",
  };

  const formatDate = (date: string) => format(new Date(date), "dd/MM/yyyy");

  if (!resident) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border border-solid border-border max-w-5xl mx-auto">
        <DrawerHeader>
          <DrawerTitle>Histórico de Pagamentos</DrawerTitle>
          <DrawerDescription>Morador: {resident?.name}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-x-auto">
          <Table className="border border-solid border-border w-full">
            <TableHeader>
              <TableRow className="border-b border-solid border-border">
                <TableHead className="border-r border-solid border-border">
                  Vencimento
                </TableHead>
                <TableHead className="border-r border-solid border-border">
                  Pagamento
                </TableHead>
                <TableHead className="border-r border-solid border-border">
                  Valor
                </TableHead>
                <TableHead className="border-r border-solid border-border">
                  Método
                </TableHead>
                <TableHead className="border-r border-solid border-border">
                  Referência
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow
                  key={p.id}
                  className="border-b border-solid border-border"
                >
                  <TableCell className="border-r border-solid border-border">
                    {formatDate(p.dueDate)}
                  </TableCell>
                  <TableCell className="border-r border-solid border-border">
                    {p.paymentDate ? formatDate(p.paymentDate) : "-"}
                  </TableCell>
                  <TableCell className="border-r border-solid border-border">
                    R$ {p.amount}
                  </TableCell>
                  <TableCell className="border-r border-solid border-border">
                    {p.method ?? "-"}
                  </TableCell>
                  <TableCell className="border-r border-solid border-border">
                    {p.reference ?? "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        statusColor[p.status]
                      }`}
                    >
                      {p.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
