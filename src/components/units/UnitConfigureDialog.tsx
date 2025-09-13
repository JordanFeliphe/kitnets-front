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
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  FileText, 
  Bell, 
  DollarSign,
  Calendar,
  Wrench,
  Droplets,
  Zap,
  Flame,
  Wifi,
  ExternalLink
} from "lucide-react"

interface UnitData {
  id: number
  number: string
  contractId?: string
}

interface UnitConfigureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: UnitData | null
  onSave: (data: UnitConfigData) => Promise<void>
}

const unitConfigSchema = z.object({
  // Contract Settings
  autoCreateContract: z.boolean(),
  defaultContractDuration: z.number().min(1).max(60),
  requireDeposit: z.boolean(),
  depositMultiplier: z.number().min(0).max(5),
  
  // Utilities Configuration
  utilities: z.object({
    water: z.boolean(),
    electricity: z.boolean(),
    gas: z.boolean(),
    internet: z.boolean(),
  }),
  
  // Payment Settings
  dueDay: z.number().min(1).max(31),
  lateFeeDays: z.number().min(0).max(30),
  lateFeeAmount: z.number().min(0),
  autoGenerateInvoices: z.boolean(),
  
  // Notification Settings
  notifications: z.object({
    paymentReminder: z.boolean(),
    maintenanceAlerts: z.boolean(),
    contractExpiration: z.boolean(),
    inspectionReminders: z.boolean(),
  }),
  
  // Special Settings
  specialInstructions: z.string().optional(),
  maintenanceNotes: z.string().optional(),
  priority: z.enum(["low", "normal", "high"]),
})

type UnitConfigData = z.infer<typeof unitConfigSchema>

const mockContracts = [
  { id: "CONT-001", tenant: "João Silva", startDate: "2024-01-01", endDate: "2024-12-31" },
  { id: "CONT-002", tenant: "Maria Santos", startDate: "2024-02-01", endDate: "2025-01-31" },
]

export function UnitConfigureDialog({ open, onOpenChange, unit, onSave }: UnitConfigureDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<UnitConfigData>({
    resolver: zodResolver(unitConfigSchema),
    defaultValues: {
      autoCreateContract: true,
      defaultContractDuration: 12,
      requireDeposit: true,
      depositMultiplier: 1,
      utilities: {
        water: true,
        electricity: true,
        gas: false,
        internet: false,
      },
      dueDay: 5,
      lateFeeDays: 5,
      lateFeeAmount: 50,
      autoGenerateInvoices: true,
      notifications: {
        paymentReminder: true,
        maintenanceAlerts: true,
        contractExpiration: true,
        inspectionReminders: false,
      },
      specialInstructions: "",
      maintenanceNotes: "",
      priority: "normal",
    },
  })

  const handleSubmit = async (data: UnitConfigData) => {
    setIsLoading(true)
    try {
      await onSave(data)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving unit config:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const linkedContract = mockContracts.find(c => c.id === unit?.contractId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-teal-500" />
            Configurar Unidade {unit?.number}
          </DialogTitle>
          <DialogDescription>
            Configure opções avançadas e automações para esta unidade.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Contract Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-4 w-4" />
                Gestão de Contratos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {linkedContract && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-teal-900">Contrato Ativo</div>
                      <div className="text-sm text-teal-700">
                        {linkedContract.tenant} • {linkedContract.id}
                      </div>
                      <div className="text-xs text-teal-600">
                        {linkedContract.startDate} até {linkedContract.endDate}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-teal-600 border-teal-600">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ver Contrato
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoCreateContract"
                    checked={form.watch("autoCreateContract")}
                    onCheckedChange={(checked) => form.setValue("autoCreateContract", !!checked)}
                  />
                  <Label htmlFor="autoCreateContract" className="text-sm">
                    Criar contratos automaticamente
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requireDeposit"
                    checked={form.watch("requireDeposit")}
                    onCheckedChange={(checked) => form.setValue("requireDeposit", !!checked)}
                  />
                  <Label htmlFor="requireDeposit" className="text-sm">
                    Exigir depósito caução
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultDuration">Duração padrão (meses)</Label>
                  <Input
                    id="defaultDuration"
                    type="number"
                    min="1"
                    max="60"
                    {...form.register("defaultContractDuration", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="depositMultiplier">Multiplicador do depósito</Label>
                  <Select
                    value={form.watch("depositMultiplier").toString()}
                    onValueChange={(value) => form.setValue("depositMultiplier", parseFloat(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sem depósito</SelectItem>
                      <SelectItem value="0.5">0.5x do aluguel</SelectItem>
                      <SelectItem value="1">1x do aluguel</SelectItem>
                      <SelectItem value="2">2x do aluguel</SelectItem>
                      <SelectItem value="3">3x do aluguel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utilities Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wrench className="h-4 w-4" />
                Utilidades Incluídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="water"
                    checked={form.watch("utilities.water")}
                    onCheckedChange={(checked) => form.setValue("utilities.water", !!checked)}
                  />
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <Label htmlFor="water" className="text-sm">Água</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="electricity"
                    checked={form.watch("utilities.electricity")}
                    onCheckedChange={(checked) => form.setValue("utilities.electricity", !!checked)}
                  />
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <Label htmlFor="electricity" className="text-sm">Energia</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gas"
                    checked={form.watch("utilities.gas")}
                    onCheckedChange={(checked) => form.setValue("utilities.gas", !!checked)}
                  />
                  <Flame className="h-4 w-4 text-orange-500" />
                  <Label htmlFor="gas" className="text-sm">Gás</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internet"
                    checked={form.watch("utilities.internet")}
                    onCheckedChange={(checked) => form.setValue("utilities.internet", !!checked)}
                  />
                  <Wifi className="h-4 w-4 text-purple-500" />
                  <Label htmlFor="internet" className="text-sm">Internet</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-4 w-4" />
                Configurações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoGenerateInvoices"
                  checked={form.watch("autoGenerateInvoices")}
                  onCheckedChange={(checked) => form.setValue("autoGenerateInvoices", !!checked)}
                />
                <Label htmlFor="autoGenerateInvoices" className="text-sm">
                  Gerar faturas automaticamente
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDay">Dia de vencimento</Label>
                  <Select
                    value={form.watch("dueDay").toString()}
                    onValueChange={(value) => form.setValue("dueDay", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          Dia {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lateFeeDays">Multa após (dias)</Label>
                  <Input
                    id="lateFeeDays"
                    type="number"
                    min="0"
                    max="30"
                    {...form.register("lateFeeDays", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lateFeeAmount">Valor da multa (R$)</Label>
                  <Input
                    id="lateFeeAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    {...form.register("lateFeeAmount", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-4 w-4" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="paymentReminder"
                    checked={form.watch("notifications.paymentReminder")}
                    onCheckedChange={(checked) => form.setValue("notifications.paymentReminder", !!checked)}
                  />
                  <Label htmlFor="paymentReminder" className="text-sm">
                    Lembrete de pagamento
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="maintenanceAlerts"
                    checked={form.watch("notifications.maintenanceAlerts")}
                    onCheckedChange={(checked) => form.setValue("notifications.maintenanceAlerts", !!checked)}
                  />
                  <Label htmlFor="maintenanceAlerts" className="text-sm">
                    Alertas de manutenção
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="contractExpiration"
                    checked={form.watch("notifications.contractExpiration")}
                    onCheckedChange={(checked) => form.setValue("notifications.contractExpiration", !!checked)}
                  />
                  <Label htmlFor="contractExpiration" className="text-sm">
                    Expiração de contrato
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inspectionReminders"
                    checked={form.watch("notifications.inspectionReminders")}
                    onCheckedChange={(checked) => form.setValue("notifications.inspectionReminders", !!checked)}
                  />
                  <Label htmlFor="inspectionReminders" className="text-sm">
                    Lembretes de vistoria
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações Especiais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade da Unidade</Label>
                <Select
                  value={form.watch("priority")}
                  onValueChange={(value) => form.setValue("priority", value as "low" | "normal" | "high")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Baixa
                      </Badge>
                    </SelectItem>
                    <SelectItem value="normal">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Normal
                      </Badge>
                    </SelectItem>
                    <SelectItem value="high">
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        Alta
                      </Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Instruções Especiais</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Instruções especiais para esta unidade..."
                  rows={3}
                  {...form.register("specialInstructions")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceNotes">Notas de Manutenção</Label>
                <Textarea
                  id="maintenanceNotes"
                  placeholder="Histórico ou notas importantes sobre manutenção..."
                  rows={3}
                  {...form.register("maintenanceNotes")}
                />
              </div>
            </CardContent>
          </Card>

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
              {isLoading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}