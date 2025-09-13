import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Trash2, 
  AlertTriangle, 
  Users, 
  FileText, 
  DollarSign,
  Calendar
} from "lucide-react"

interface UnitData {
  id: number
  number: string
  type: string
  status: string
  rent: string
  currentTenant?: string
  activeContract?: boolean
  pendingPayments?: number
}

interface UnitDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: UnitData | null
  onConfirm: (unitId: number) => Promise<void>
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

export function UnitDeleteDialog({ open, onOpenChange, unit, onConfirm }: UnitDeleteDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleConfirm = async () => {
    if (!unit) return

    setIsLoading(true)
    try {
      await onConfirm(unit.id)
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting unit:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Check for blocking conditions
  const hasBlockingConditions = unit && (
    unit.currentTenant || 
    unit.activeContract || 
    (unit.pendingPayments && unit.pendingPayments > 0)
  )

  const blockingReasons = []
  if (unit?.currentTenant) {
    blockingReasons.push("Possui morador ativo")
  }
  if (unit?.activeContract) {
    blockingReasons.push("Possui contrato ativo")
  }
  if (unit?.pendingPayments && unit.pendingPayments > 0) {
    blockingReasons.push("Possui pagamentos pendentes")
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[95vw] sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Excluir Unidade {unit?.number}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-red-900 font-medium">
                    Esta ação não pode ser desfeita!
                  </p>
                  <p className="text-red-700 text-sm">
                    Todos os dados relacionados à unidade serão removidos permanentemente.
                  </p>
                </div>
              </div>

              {unit && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Detalhes da Unidade:</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Número:</span>
                      <span className="font-medium">{unit.number}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{unit.type}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="outline" className={getStatusColor(unit.status)}>
                        {unit.status}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Aluguel:</span>
                      <span className="font-medium">R$ {unit.rent}</span>
                    </div>
                  </div>

                  {hasBlockingConditions && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-amber-600">
                          <AlertTriangle className="h-4 w-4" />
                          <h4 className="font-medium">Condições que impedem a exclusão:</h4>
                        </div>
                        
                        <div className="space-y-2">
                          {unit.currentTenant && (
                            <div className="flex items-center gap-3 p-2 bg-amber-50 border border-amber-200 rounded">
                              <Users className="h-4 w-4 text-amber-600" />
                              <div className="flex-1">
                                <div className="font-medium text-amber-900">Morador Ativo</div>
                                <div className="text-sm text-amber-700">{unit.currentTenant}</div>
                              </div>
                            </div>
                          )}
                          
                          {unit.activeContract && (
                            <div className="flex items-center gap-3 p-2 bg-amber-50 border border-amber-200 rounded">
                              <FileText className="h-4 w-4 text-amber-600" />
                              <div className="flex-1">
                                <div className="font-medium text-amber-900">Contrato Ativo</div>
                                <div className="text-sm text-amber-700">Encerre o contrato antes de excluir</div>
                              </div>
                            </div>
                          )}
                          
                          {unit.pendingPayments && unit.pendingPayments > 0 && (
                            <div className="flex items-center gap-3 p-2 bg-amber-50 border border-amber-200 rounded">
                              <DollarSign className="h-4 w-4 text-amber-600" />
                              <div className="flex-1">
                                <div className="font-medium text-amber-900">Pagamentos Pendentes</div>
                                <div className="text-sm text-amber-700">
                                  {unit.pendingPayments} pagamento(s) em aberto
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
                          <strong>Resolva essas pendências antes de excluir a unidade:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {blockingReasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}

                  {!hasBlockingConditions && (
                    <>
                      <Separator />
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                        <strong>O que será excluído:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Todas as informações da unidade</li>
                          <li>Histórico de contratos encerrados</li>
                          <li>Histórico de pagamentos</li>
                          <li>Configurações específicas</li>
                          <li>Relatórios e estatísticas</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          
          {hasBlockingConditions ? (
            <AlertDialogAction
              disabled
              className="bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
            >
              Não é possível excluir
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              {isLoading ? "Excluindo..." : "Sim, excluir unidade"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}