import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Importando o Select do Shadcn

const residentSchema = z.object({
  name: z.string().min(1),
  cpf: z.string().min(11),
  phone: z.string().min(8),
  email: z.string().email(),
  unit: z.string().min(1),
  entryDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Data inválida" }),
  rentAmount: z.string().regex(/^\d+(\.\d{2})?$/, "Formato de moeda inválido"),
  status: z.enum(["Active", "Inactive"]),
})

type ResidentForm = z.infer<typeof residentSchema>

interface Props {
  onSubmit: (data: ResidentForm) => void
  initialData?: ResidentForm
}

export const CreateResidentModal: React.FC<Props> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    trigger,
  } = useForm<ResidentForm>({
    resolver: zodResolver(residentSchema),
    defaultValues: initialData,
  })

  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>()

  React.useEffect(() => {
    if (initialData?.entryDate) {
      const parsed = new Date(initialData.entryDate)
      if (!isNaN(parsed.getTime())) setCalendarDate(parsed)
    }
  }, [initialData])

  const submitHandler = async (data: ResidentForm) => {
    await onSubmit(data)
    reset()
    setCalendarDate(undefined)
  }

  return (
    <DialogContent className="border border-solid border-border">
      <DialogHeader>
        <DialogTitle>{initialData ? "Editar Morador" : "Cadastrar Morador"}</DialogTitle>
        <DialogDescription>Preencha os dados do morador.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" {...register("cpf")} />
          {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="unit">Unidade</Label>
          <Input id="unit" {...register("unit")} />
          {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
        </div>
        <div>
          <Label>Data de Entrada</Label>
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
                  setCalendarDate(selectedDate)
                  if (selectedDate) {
                    const iso = selectedDate.toISOString().split("T")[0]
                    setValue("entryDate", iso)
                    trigger("entryDate")
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.entryDate && <p className="text-sm text-red-500">{errors.entryDate.message}</p>}
        </div>
        <div>
          <Label htmlFor="rentAmount">Valor do Aluguel</Label>
          <Input id="rentAmount" {...register("rentAmount")} />
          {errors.rentAmount && <p className="text-sm text-red-500">{errors.rentAmount.message}</p>}
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select {...register("status")}>
            <SelectTrigger className="w-full border border-solid border-border rounded px-2 py-1">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Ativo</SelectItem>
              <SelectItem value="Inactive">Inativo</SelectItem>
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
  )
}
