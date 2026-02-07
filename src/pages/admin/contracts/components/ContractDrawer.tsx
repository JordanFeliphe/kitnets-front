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
import { Badge } from "@/app/shared/components/ui/badge"
import { Separator } from "@/app/shared/components/ui/separator"
import { Checkbox } from "@/app/shared/components/ui/checkbox"
import { Lease, LeaseStatus } from "@/app/shared/types"
import { FileText, Calendar, DollarSign, RefreshCw } from "lucide-react"

const contractFormSchema = z.object({
  unitId: z.string().min(1, "Unidade é obrigatória"),
  tenantId: z.string().min(1, "Inquilino é obrigatório"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de fim é obrigatória"),
  monthlyRent: z.number().min(0, "Valor do aluguel deve ser maior ou igual a 0"),
  deposit: z.number().min(0, "Valor do depósito deve ser maior ou igual a 0"),
  status: z.enum(["ACTIVE", "EXPIRED", "TERMINATED", "PENDING"]),
  terms: z.string().min(10, "Termos devem ter pelo menos 10 caracteres"),
  documents: z.object({
    contract: z.string().optional(),
    tenantId: z.string().optional(),
    guarantorId: z.string().optional(),
    proofOfIncome: z.array(z.string()).optional(),
  }),
  renewalOptions: z.object({
    automatic: z.boolean(),
    noticePeriod: z.number().min(1, "Período de aviso deve ser pelo menos 1 dia"),
    rentIncrease: z.number().min(0, "Aumento do aluguel deve ser maior ou igual a 0"),
  }),
  terminationReason: z.string().optional(),
})

type ContractFormData = z.infer<typeof contractFormSchema>

interface ContractDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | "view"
  contract?: Lease
  onSubmit: (data: ContractFormData) => Promise<void>
  availableUnits?: Array<{ id: string; code: string }>
  availableTenants?: Array<{ id: string; name: string; email: string }>
}

const statusLabels: Record<LeaseStatus, string> = {
  ACTIVE: "Ativo",
  EXPIRED: "Expirado",
  TERMINATED: "Rescindido",
  PENDING: "Pendente",
}

const statusVariants: Record<LeaseStatus, "success" | "destructive" | "secondary" | "warning"> = {
  ACTIVE: "success",
  EXPIRED: "destructive",
  TERMINATED: "secondary",
  PENDING: "warning",
}

export function ContractDrawer({ 
  open, 
  onOpenChange, 
  mode, 
  contract, 
  onSubmit,
  availableUnits = [],
  availableTenants = []
}: ContractDrawerProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const isReadOnly = mode === "view"

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: contract ? {
      unitId: contract.unitId,
      tenantId: contract.tenantId,
      startDate: new Date(contract.startDate).toISOString().split('T')[0],
      endDate: new Date(contract.endDate).toISOString().split('T')[0],
      monthlyRent: contract.monthlyRent,
      deposit: contract.deposit,
      status: contract.status,
      terms: contract.terms,
      documents: contract.documents,
      renewalOptions: contract.renewalOptions,
      terminationReason: contract.terminationReason,
    } : {
      unitId: "",
      tenantId: "",
      startDate: "",
      endDate: "",
      monthlyRent: 0,
      deposit: 0,
      status: "PENDING" as LeaseStatus,
      terms: "",
      documents: {
        contract: "",
        tenantId: "",
        guarantorId: "",
        proofOfIncome: [],
      },
      renewalOptions: {
        automatic: false,
        noticePeriod: 30,
        rentIncrease: 0,
      },
      terminationReason: "",
    },
  })

  const handleSubmit = async (data: ContractFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving contract:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Novo Contrato"
      case "edit":
        return `Editar Contrato`
      case "view":
        return `Detalhes do Contrato`
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "create":
        return "Cadastre um novo contrato de locação"
      case "edit":
        return "Atualize as informações do contrato"
      case "view":
        return "Visualize todas as informações do contrato"
    }
  }

  const calculateContractDuration = () => {
    const start = form.watch("startDate")
    const end = form.watch("endDate")
    
    if (start && end) {
      const startDate = new Date(start)
      const endDate = new Date(end)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const months = Math.floor(diffDays / 30)
      return `${months} meses (${diffDays} dias)`
    }
    return "Selecione as datas"
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-3xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {getTitle()}
            </DrawerTitle>
            <DrawerDescription>{getDescription()}</DrawerDescription>
          </DrawerHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-4">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Informações Básicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unitId">Unidade*</Label>
                    <Select 
                      value={form.watch("unitId")} 
                      onValueChange={(value) => form.setValue("unitId", value)}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUnits.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.unitId && (
                      <p className="text-sm text-destructive">{form.formState.errors.unitId.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tenantId">Inquilino*</Label>
                    <Select 
                      value={form.watch("tenantId")} 
                      onValueChange={(value) => form.setValue("tenantId", value)}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um inquilino" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            <div>
                              <div className="font-medium">{tenant.name}</div>
                              <div className="text-sm text-muted-foreground">{tenant.email}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.tenantId && (
                      <p className="text-sm text-destructive">{form.formState.errors.tenantId.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={form.watch("status")} 
                      onValueChange={(value: LeaseStatus) => form.setValue("status", value)}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              <Badge variant={statusVariants[value as LeaseStatus]}>
                                {label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {form.watch("status") === "TERMINATED" && (
                    <div>
                      <Label htmlFor="terminationReason">Motivo da Rescisão</Label>
                      <Input
                        id="terminationReason"
                        placeholder="Motivo da rescisão..."
                        disabled={isReadOnly}
                        {...form.register("terminationReason")}
                      />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Dates and Duration */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Período do Contrato
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data de Início*</Label>
                    <Input
                      id="startDate"
                      type="date"
                      disabled={isReadOnly}
                      {...form.register("startDate")}
                    />
                    {form.formState.errors.startDate && (
                      <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="endDate">Data de Fim*</Label>
                    <Input
                      id="endDate"
                      type="date"
                      disabled={isReadOnly}
                      {...form.register("endDate")}
                    />
                    {form.formState.errors.endDate && (
                      <p className="text-sm text-destructive">{form.formState.errors.endDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Duração</Label>
                    <div className="text-sm text-muted-foreground mt-2">
                      {calculateContractDuration()}
                    </div>
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
                    {form.formState.errors.monthlyRent && (
                      <p className="text-sm text-destructive">{form.formState.errors.monthlyRent.message}</p>
                    )}
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
                    {form.formState.errors.deposit && (
                      <p className="text-sm text-destructive">{form.formState.errors.deposit.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Renewal Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Opções de Renovação
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="automatic"
                      checked={form.watch("renewalOptions.automatic")}
                      onCheckedChange={(checked) => form.setValue("renewalOptions.automatic", !!checked)}
                      disabled={isReadOnly}
                    />
                    <Label htmlFor="automatic">Renovação automática</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="noticePeriod">Período de Aviso (dias)</Label>
                      <Input
                        id="noticePeriod"
                        type="number"
                        min="1"
                        disabled={isReadOnly}
                        {...form.register("renewalOptions.noticePeriod", { valueAsNumber: true })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="rentIncrease">Aumento do Aluguel (%)</Label>
                      <Input
                        id="rentIncrease"
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={isReadOnly}
                        {...form.register("renewalOptions.rentIncrease", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Termos e Condições</h3>
                
                <div>
                  <Label htmlFor="terms">Termos do Contrato*</Label>
                  <Textarea
                    id="terms"
                    placeholder="Digite os termos e condições do contrato..."
                    rows={6}
                    disabled={isReadOnly}
                    {...form.register("terms")}
                  />
                  {form.formState.errors.terms && (
                    <p className="text-sm text-destructive">{form.formState.errors.terms.message}</p>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Documentos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contractDoc">Contrato Assinado</Label>
                    <Input
                      id="contractDoc"
                      placeholder="URL ou caminho do documento"
                      disabled={isReadOnly}
                      {...form.register("documents.contract")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tenantIdDoc">RG/CPF do Inquilino</Label>
                    <Input
                      id="tenantIdDoc"
                      placeholder="URL ou caminho do documento"
                      disabled={isReadOnly}
                      {...form.register("documents.tenantId")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="guarantorIdDoc">RG/CPF do Fiador</Label>
                    <Input
                      id="guarantorIdDoc"
                      placeholder="URL ou caminho do documento"
                      disabled={isReadOnly}
                      {...form.register("documents.guarantorId")}
                    />
                  </div>
                </div>
              </div>

              {mode === "view" && contract && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Data de Criação</Label>
                      <div className="text-sm text-muted-foreground">
                        {new Date(contract.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div>
                      <Label>Última Atualização</Label>
                      <div className="text-sm text-muted-foreground">
                        {new Date(contract.updatedAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    {contract.terminatedAt && (
                      <div className="md:col-span-2">
                        <Label>Data de Rescisão</Label>
                        <div className="text-sm text-muted-foreground">
                          {new Date(contract.terminatedAt).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <DrawerFooter>
              <div className="flex gap-2">
                {!isReadOnly && (
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Salvando..." : mode === "create" ? "Criar Contrato" : "Salvar Alterações"}
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