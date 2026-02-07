import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/app/shared/components/ui/drawer"
import { Button } from "@/app/shared/components/ui/button"
import { Input } from "@/app/shared/components/ui/input"
import { Label } from "@/app/shared/components/ui/label"
import { Textarea } from "@/app/shared/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select"
import { Checkbox } from "@/app/shared/components/ui/checkbox"
import { Badge } from "@/app/shared/components/ui/badge"
import { Separator } from "@/app/shared/components/ui/separator"
import { Unit, UnitStatus } from "@/app/shared/types"
import { Building, MapPin, DollarSign, Wrench } from "lucide-react"

const unitFormSchema = z.object({
  code: z.string().min(1, "Código da unidade é obrigatório"),
  description: z.string().optional(),
  floor: z.number().min(0, "Andar deve ser maior ou igual a 0"),
  area: z.number().min(1, "Área deve ser maior que 0"),
  bedrooms: z.number().min(0, "Número de quartos deve ser maior ou igual a 0"),
  bathrooms: z.number().min(1, "Deve ter pelo menos 1 banheiro"),
  hasKitchen: z.boolean(),
  hasPatio: z.boolean(),
  monthlyRent: z.number().min(0, "Valor do aluguel deve ser maior ou igual a 0"),
  deposit: z.number().min(0, "Valor do depósito deve ser maior ou igual a 0"),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"]),
  utilities: z.object({
    water: z.boolean(),
    electricity: z.boolean(),
    gas: z.boolean(),
    internet: z.boolean(),
  }),
})

type UnitFormData = z.infer<typeof unitFormSchema>

interface UnitDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | "view"
  unit?: Unit
  onSubmit: (data: UnitFormData) => Promise<void>
}

const statusLabels: Record<UnitStatus, string> = {
  AVAILABLE: "Disponível",
  OCCUPIED: "Ocupada",
  MAINTENANCE: "Manutenção",
  RESERVED: "Reservada",
}

const statusVariants: Record<UnitStatus, "success" | "info" | "destructive" | "warning"> = {
  AVAILABLE: "success",
  OCCUPIED: "info",
  MAINTENANCE: "destructive",
  RESERVED: "warning",
}

export function UnitDrawer({ open, onOpenChange, mode, unit, onSubmit }: UnitDrawerProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const isReadOnly = mode === "view"

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: unit ? {
      code: unit.code,
      description: unit.description,
      floor: unit.floor,
      area: unit.area,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      hasKitchen: unit.hasKitchen,
      hasPatio: unit.hasPatio,
      monthlyRent: unit.monthlyRent,
      deposit: unit.deposit,
      status: unit.status,
      utilities: unit.utilities,
    } : {
      code: "",
      description: "",
      floor: 0,
      area: 0,
      bedrooms: 0,
      bathrooms: 1,
      hasKitchen: true,
      hasPatio: false,
      monthlyRent: 0,
      deposit: 0,
      status: "AVAILABLE" as UnitStatus,
      utilities: {
        water: true,
        electricity: true,
        gas: false,
        internet: false,
      },
    },
  })

  const handleSubmit = async (data: UnitFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving unit:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Nova Unidade"
      case "edit":
        return `Editar Unidade ${unit?.code}`
      case "view":
        return `Detalhes da Unidade ${unit?.code}`
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "create":
        return "Cadastre uma nova unidade no sistema"
      case "edit":
        return "Atualize as informações da unidade"
      case "view":
        return "Visualize todas as informações da unidade"
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {getTitle()}
            </DrawerTitle>
            <DrawerDescription>{getDescription()}</DrawerDescription>
          </DrawerHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-4">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Informações Básicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Código da Unidade*</Label>
                    <Input
                      id="code"
                      placeholder="Ex: 10A, 5B"
                      disabled={isReadOnly}
                      {...form.register("code")}
                    />
                    {form.formState.errors.code && (
                      <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={form.watch("status")} 
                      onValueChange={(value: UnitStatus) => form.setValue("status", value)}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              <Badge variant={statusVariants[value as UnitStatus]}>
                                {label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descrição adicional da unidade..."
                      disabled={isReadOnly}
                      {...form.register("description")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Physical Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Detalhes Físicos
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="floor">Andar</Label>
                    <Input
                      id="floor"
                      type="number"
                      min="0"
                      disabled={isReadOnly}
                      {...form.register("floor", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="area">Área (m²)*</Label>
                    <Input
                      id="area"
                      type="number"
                      min="1"
                      step="0.01"
                      disabled={isReadOnly}
                      {...form.register("area", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      disabled={isReadOnly}
                      {...form.register("bedrooms", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Banheiros*</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="1"
                      disabled={isReadOnly}
                      {...form.register("bathrooms", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasKitchen"
                      checked={form.watch("hasKitchen")}
                      onCheckedChange={(checked) => form.setValue("hasKitchen", !!checked)}
                      disabled={isReadOnly}
                    />
                    <Label htmlFor="hasKitchen">Possui cozinha</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasPatio"
                      checked={form.watch("hasPatio")}
                      onCheckedChange={(checked) => form.setValue("hasPatio", !!checked)}
                      disabled={isReadOnly}
                    />
                    <Label htmlFor="hasPatio">Possui pátio</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Informações Financeiras
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyRent">Aluguel Mensal (R$)*</Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isReadOnly}
                      {...form.register("monthlyRent", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="deposit">Depósito (R$)</Label>
                    <Input
                      id="deposit"
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isReadOnly}
                      {...form.register("deposit", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Utilities */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Utilidades Incluídas
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="water"
                      checked={form.watch("utilities.water")}
                      onCheckedChange={(checked) => form.setValue("utilities.water", !!checked)}
                      disabled={isReadOnly}
                    />
                    <Label htmlFor="water">Água</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="electricity"
                      checked={form.watch("utilities.electricity")}
                      onCheckedChange={(checked) => form.setValue("utilities.electricity", !!checked)}
                      disabled={isReadOnly}
                    />
                    <Label htmlFor="electricity">Energia</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gas"
                      checked={form.watch("utilities.gas")}
                      onCheckedChange={(checked) => form.setValue("utilities.gas", !!checked)}
                      disabled={isReadOnly}
                    />
                    <Label htmlFor="gas">Gás</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="internet"
                      checked={form.watch("utilities.internet")}
                      onCheckedChange={(checked) => form.setValue("utilities.internet", !!checked)}
                      disabled={isReadOnly}
                    />
                    <Label htmlFor="internet">Internet</Label>
                  </div>
                </div>
              </div>
            </div>

            <DrawerFooter>
              <div className="flex gap-2">
                {!isReadOnly && (
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Salvando..." : mode === "create" ? "Criar Unidade" : "Salvar Alterações"}
                  </Button>
                )}
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1">
                    {isReadOnly ? "Fechar" : "Cancelar"}
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}