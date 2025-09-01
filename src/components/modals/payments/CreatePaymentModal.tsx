import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Adicionando import para Select

const paymentSchema = z.object({
  residentName: z.string().min(1),
  amount: z.string().regex(/^\d+(\.\d{2})?$/, "Formato de moeda inválido"),
  paymentDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida" }),
  paymentMethod: z.enum(["Cash", "Card", "Bank Transfer"]),
  status: z.enum(["Paid", "Pending"]),
});

type PaymentForm = z.infer<typeof paymentSchema>;

interface Props {
  onSubmit: (data: PaymentForm) => void;
  initialData?: PaymentForm;
}

export const CreatePaymentModal: React.FC<Props> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    trigger,
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData,
  });

  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>();

  React.useEffect(() => {
    if (initialData?.paymentDate) {
      const parsed = new Date(initialData.paymentDate);
      if (!isNaN(parsed.getTime())) setCalendarDate(parsed);
    }
  }, [initialData]);

  const submitHandler = async (data: PaymentForm) => {
    await onSubmit(data);
    reset();
    setCalendarDate(undefined);
  };

  return (
    <DialogContent className="border border-solid border-border">
      <DialogHeader>
        <DialogTitle>{initialData ? "Editar Pagamento" : "Cadastrar Pagamento"}</DialogTitle>
        <DialogDescription>Preencha os dados do pagamento.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <div>
          <Label htmlFor="residentName">Morador</Label>
          <Input id="residentName" {...register("residentName")} />
          {errors.residentName && <p className="text-sm text-red-500">{errors.residentName.message}</p>}
        </div>
        <div>
          <Label htmlFor="amount">Valor</Label>
          <Input id="amount" {...register("amount")} />
          {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
        </div>
        <div>
          <Label>Data de Pagamento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!calendarDate ? "text-muted-foreground" : ""}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {calendarDate ? format(calendarDate, "dd/MM/yyyy") : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={(selectedDate) => {
                  setCalendarDate(selectedDate);
                  if (selectedDate) {
                    const iso = selectedDate.toISOString().split("T")[0];
                    setValue("paymentDate", iso);
                    trigger("paymentDate");
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.paymentDate && <p className="text-sm text-red-500">{errors.paymentDate.message}</p>}
        </div>
        <div>
          <Label htmlFor="paymentMethod">Método de Pagamento</Label>
          <Select {...register("paymentMethod")}>
            <SelectTrigger className="w-full border border-solid border-border rounded px-2 py-1">
              <SelectValue placeholder="Selecione um método de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Dinheiro</SelectItem>
              <SelectItem value="Card">Cartão</SelectItem>
              <SelectItem value="Bank Transfer">Transferência Bancária</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentMethod && <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>}
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select {...register("status")}>
            <SelectTrigger className="w-full border border-solid border-border rounded px-2 py-1">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paid">Pago</SelectItem>
              <SelectItem value="Pending">Pendente</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Atualizar" : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
