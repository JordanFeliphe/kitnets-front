import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar,
  Receipt,
  Droplets,
  Zap,
  Flame,
  Wifi
} from "lucide-react"

interface PaymentHistory {
  date: string
  amount: number
  status: "paid" | "pending" | "overdue"
  method?: string
}

interface UnitDetails {
  id: number
  number: string
  type: string
  area: string
  rent: string
  status: string
  resident?: string
  lastPayment?: string
  floor?: number
  description?: string
  utilities?: {
    water: boolean
    electricity: boolean
    gas: boolean
    internet: boolean
  }
  paymentHistory?: PaymentHistory[]
  contractId?: string
  createdAt?: string
  updatedAt?: string
}

interface UnitViewDetailsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: UnitDetails | null
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'ocupada':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'vazia':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'manutenção':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'overdue':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function UnitViewDetailsDrawer({ open, onOpenChange, unit }: UnitViewDetailsDrawerProps) {
  if (!unit) return null

  const mockPaymentHistory: PaymentHistory[] = [
    { date: "2024-01-15", amount: 1200, status: "paid", method: "PIX" },
    { date: "2024-02-15", amount: 1200, status: "paid", method: "Transferência" },
    { date: "2024-03-15", amount: 1200, status: "pending" },
  ]

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-teal-500" />
              Detalhes da Unidade {unit.number}
            </DrawerTitle>
            <DrawerDescription>
              Informações completas sobre a unidade e histórico de pagamentos
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className={getStatusColor(unit.status)}>
                    {unit.status}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aluguel Mensal</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-600">R$ {unit.rent}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Área</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{unit.area} m²</div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Unit Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Informações da Unidade
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número:</span>
                    <span className="font-medium">{unit.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">{unit.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Andar:</span>
                    <span className="font-medium">{unit.floor || "Térreo"}</span>
                  </div>
                  {unit.description && (
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">Descrição:</span>
                      <span className="text-sm">{unit.description}</span>
                    </div>
                  )}
                </div>

                {/* Utilities */}
                {unit.utilities && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Utilidades Incluídas</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`flex items-center gap-2 p-2 rounded ${unit.utilities.water ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
                        <Droplets className="h-4 w-4" />
                        <span className="text-sm">Água</span>
                      </div>
                      <div className={`flex items-center gap-2 p-2 rounded ${unit.utilities.electricity ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-500'}`}>
                        <Zap className="h-4 w-4" />
                        <span className="text-sm">Energia</span>
                      </div>
                      <div className={`flex items-center gap-2 p-2 rounded ${unit.utilities.gas ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>
                        <Flame className="h-4 w-4" />
                        <span className="text-sm">Gás</span>
                      </div>
                      <div className={`flex items-center gap-2 p-2 rounded ${unit.utilities.internet ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-500'}`}>
                        <Wifi className="h-4 w-4" />
                        <span className="text-sm">Internet</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Morador Atual
                </h3>
                
                {unit.resident ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nome:</span>
                      <span className="font-medium">{unit.resident}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Último Pagamento:</span>
                      <span className="font-medium">{unit.lastPayment || "N/A"}</span>
                    </div>
                    {unit.contractId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contrato:</span>
                        <span className="font-medium text-teal-600">#{unit.contractId}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Unidade vazia</p>
                    <p className="text-sm">Nenhum morador atribuído</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Payment History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Histórico de Pagamentos
              </h3>
              
              {mockPaymentHistory.length > 0 ? (
                <div className="space-y-2">
                  {mockPaymentHistory.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {new Date(payment.date).toLocaleDateString("pt-BR")}
                          </div>
                          {payment.method && (
                            <div className="text-sm text-muted-foreground">
                              {payment.method}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-medium">
                            R$ {payment.amount.toFixed(2)}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={getPaymentStatusColor(payment.status)}
                        >
                          {payment.status === 'paid' ? 'Pago' : 
                           payment.status === 'pending' ? 'Pendente' : 'Atrasado'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum histórico de pagamento</p>
                </div>
              )}
            </div>

            {/* Timestamps */}
            {(unit.createdAt || unit.updatedAt) && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  {unit.createdAt && (
                    <div>
                      <span className="font-medium">Criado em:</span>{" "}
                      {new Date(unit.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                  {unit.updatedAt && (
                    <div>
                      <span className="font-medium">Atualizado em:</span>{" "}
                      {new Date(unit.updatedAt).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Fechar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}