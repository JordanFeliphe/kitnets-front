import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building, DollarSign, MapPin } from "lucide-react"

interface UnitData {
  id: number
  number: string
  type: string
  area: string
  rent: string
  status: string
  description?: string
  floor?: number
}

interface UnitEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: UnitData | null
  onSave: (data: UnitFormData) => Promise<void>
}

const unitEditSchema = z.object({
  number: z.string().min(1, "Número da unidade é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  area: z.string().min(1, "Área é obrigatória"),
  rent: z.string().min(1, "Valor do aluguel é obrigatório"),
  status: z.enum(["Vazia", "Ocupada", "Manutenção"], {
    errorMap: () => ({ message: "Status é obrigatório" })
  }),
  description: z.string().optional(),
  floor: z.number().min(0, "Andar deve ser maior ou igual a 0").optional(),
})

type UnitFormData = z.infer<typeof unitEditSchema>

const statusOptions = [
  { value: "Vazia", label: "Vazia", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "Ocupada", label: "Ocupada", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "Manutenção", label: "Manutenção", color: "bg-red-100 text-red-800 border-red-200" },
]

const typeOptions = [
  "Kitnet",
  "Apartamento 1 quarto",
  "Apartamento 2 quartos", 
  "Apartamento 3 quartos",
  "Casa",
  "Sobrado",
  "Loft",
  "Estúdio"
]

export function UnitEditDialog({ open, onOpenChange, unit, onSave }: UnitEditDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitEditSchema),
    defaultValues: {
      number: "",
      type: "",
      area: "",
      rent: "",
      status: "Vazia",
      description: "",
      floor: 0,
    },
  })

  // Update form when unit changes
  React.useEffect(() => {
    if (unit) {
      form.reset({
        number: unit.number,
        type: unit.type,
        area: unit.area,
        rent: unit.rent,
        status: unit.status as "Vazia" | "Ocupada" | "Manutenção",
        description: unit.description || "",
        floor: unit.floor || 0,
      })
    }
  }, [unit, form])

  const handleSubmit = async (data: UnitFormData) => {
    setIsLoading(true)
    try {
      await onSave(data)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving unit:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except comma and dot
    const numericValue = value.replace(/[^\d.,]/g, '')
    
    // Convert to number and format
    const number = parseFloat(numericValue.replace(',', '.'))
    if (isNaN(number)) return ''
    
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    form.setValue('rent', formatted)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-teal-500" />
            Editar Unidade {unit?.number}
          </DialogTitle>
          <DialogDescription>
            Atualize as informações da unidade. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Número da Unidade</Label>
              <Input
                id="number"
                placeholder="Ex: 101, 2A"
                {...form.register("number")}
              />
              {form.formState.errors.number && (
                <p className="text-sm text-red-500">{form.formState.errors.number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Andar</Label>
              <Input
                id="floor"
                type="number"
                min="0"
                placeholder="0"
                {...form.register("floor", { valueAsNumber: true })}
              />
              {form.formState.errors.floor && (
                <p className="text-sm text-red-500">{form.formState.errors.floor.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo da Unidade</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(value) => form.setValue("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Área (m²)
              </Label>
              <Input
                id="area"
                placeholder="Ex: 25, 30.5"
                {...form.register("area")}
              />
              {form.formState.errors.area && (
                <p className="text-sm text-red-500">{form.formState.errors.area.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rent" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Aluguel (R$)
              </Label>
              <Input
                id="rent"
                placeholder="Ex: 1.200,00"
                value={form.watch("rent")}
                onChange={handleRentChange}
              />
              {form.formState.errors.rent && (
                <p className="text-sm text-red-500">{form.formState.errors.rent.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status da Unidade</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) => form.setValue("status", value as "Vazia" | "Ocupada" | "Manutenção")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva características especiais da unidade..."
              rows={3}
              {...form.register("description")}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-teal-500 hover:bg-teal-600"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}