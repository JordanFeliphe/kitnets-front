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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users, 
  Search, 
  UserPlus, 
  UserMinus, 
  Phone, 
  Mail, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface UnitData {
  id: number
  number: string
  currentTenant?: {
    id: string
    name: string
    email: string
    phone: string
    moveInDate?: string
    contractId?: string
    status: "active" | "pending" | "expired"
  }
}

interface Resident {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  status: "available" | "occupied" | "blocked"
  currentUnit?: string
  lastContract?: string
}

interface UnitManageTenantDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: UnitData | null
  onAssignTenant: (unitId: number, tenantId: string) => Promise<void>
  onRemoveTenant: (unitId: number) => Promise<void>
}

const mockResidents: Resident[] = [
  {
    id: "1",
    name: "João Silva Santos",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    cpf: "123.456.789-00",
    status: "available",
  },
  {
    id: "2", 
    name: "Maria Costa Oliveira",
    email: "maria.costa@email.com",
    phone: "(11) 88888-8888",
    cpf: "987.654.321-00",
    status: "available",
  },
  {
    id: "3",
    name: "Pedro Almeida",
    email: "pedro.almeida@email.com", 
    phone: "(11) 77777-7777",
    cpf: "456.789.123-00",
    status: "occupied",
    currentUnit: "102",
  },
  {
    id: "4",
    name: "Ana Rodrigues",
    email: "ana.rodrigues@email.com",
    phone: "(11) 66666-6666", 
    cpf: "321.654.987-00",
    status: "available",
  },
  {
    id: "5",
    name: "Carlos Mendes",
    email: "carlos.mendes@email.com",
    phone: "(11) 55555-5555",
    cpf: "789.123.456-00", 
    status: "blocked",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800 border-green-200"
    case "occupied":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "blocked":
      return "bg-red-100 text-red-800 border-red-200"
    case "active":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "expired":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "available":
      return "Disponível"
    case "occupied":
      return "Ocupado"
    case "blocked":
      return "Bloqueado"
    case "active":
      return "Ativo"
    case "pending":
      return "Pendente"
    case "expired":
      return "Expirado"
    default:
      return status
  }
}

export function UnitManageTenantDrawer({ 
  open, 
  onOpenChange, 
  unit, 
  onAssignTenant, 
  onRemoveTenant 
}: UnitManageTenantDrawerProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedTenant, setSelectedTenant] = React.useState<string | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [isLoading, setIsLoading] = React.useState(false)

  const filteredResidents = React.useMemo(() => {
    let filtered = mockResidents.filter(resident => {
      const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resident.phone.includes(searchTerm)
      
      const matchesStatus = statusFilter === "all" || resident.status === statusFilter
      
      return matchesSearch && matchesStatus
    })

    // Sort: available first, then occupied, then blocked
    return filtered.sort((a, b) => {
      const statusOrder = { available: 0, occupied: 1, blocked: 2 }
      return statusOrder[a.status] - statusOrder[b.status]
    })
  }, [searchTerm, statusFilter])

  const handleAssignTenant = async () => {
    if (!unit || !selectedTenant) return

    setIsLoading(true)
    try {
      await onAssignTenant(unit.id, selectedTenant)
      onOpenChange(false)
      setSelectedTenant(null)
    } catch (error) {
      console.error("Error assigning tenant:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveTenant = async () => {
    if (!unit) return

    setIsLoading(true)
    try {
      await onRemoveTenant(unit.id)
      onOpenChange(false)
    } catch (error) {
      console.error("Error removing tenant:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-500" />
              Gerenciar Morador - Unidade {unit?.number}
            </DrawerTitle>
            <DrawerDescription>
              Atribua ou remova moradores desta unidade
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-6">
            {/* Current Tenant */}
            {unit?.currentTenant ? (
              <Card className="border-teal-200 bg-teal-50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-teal-600" />
                        <h3 className="text-lg font-semibold text-teal-900">
                          Morador Atual
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(unit.currentTenant.status)}
                        >
                          {getStatusLabel(unit.currentTenant.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-teal-600" />
                          <span className="font-medium">{unit.currentTenant.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-teal-600" />
                          <span>{unit.currentTenant.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-teal-600" />
                          <span>{unit.currentTenant.phone}</span>
                        </div>
                        {unit.currentTenant.moveInDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-teal-600" />
                            <span>Mudou em {unit.currentTenant.moveInDate}</span>
                          </div>
                        )}
                        {unit.currentTenant.contractId && (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-teal-600" />
                            <span>Contrato #{unit.currentTenant.contractId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveTenant}
                      disabled={isLoading}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <UserMinus className="h-4 w-4 mr-1" />
                      Remover
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-yellow-900">
                      Unidade Vazia
                    </h3>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    Esta unidade não possui morador atribuído. Selecione um morador disponível abaixo.
                  </p>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Search and Filters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {unit?.currentTenant ? "Trocar Morador" : "Atribuir Morador"}
              </h3>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, email ou telefone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="available">Disponíveis</SelectItem>
                      <SelectItem value="occupied">Ocupados</SelectItem>
                      <SelectItem value="blocked">Bloqueados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Residents List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  Moradores Encontrados ({filteredResidents.length})
                </h4>
                {selectedTenant && (
                  <Badge variant="outline" className="bg-teal-100 text-teal-800">
                    {filteredResidents.find(r => r.id === selectedTenant)?.name} selecionado
                  </Badge>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredResidents.map((resident) => (
                  <Card 
                    key={resident.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTenant === resident.id
                        ? "ring-2 ring-teal-500 bg-teal-50"
                        : "hover:bg-muted/50"
                    } ${
                      resident.status !== "available" ? "opacity-60" : ""
                    }`}
                    onClick={() => {
                      if (resident.status === "available") {
                        setSelectedTenant(selectedTenant === resident.id ? null : resident.id)
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedTenant === resident.id}
                            disabled={resident.status !== "available"}
                            className="pointer-events-none"
                          />
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{resident.name}</span>
                              <Badge 
                                variant="outline" 
                                className={getStatusColor(resident.status)}
                              >
                                {getStatusLabel(resident.status)}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-4">
                                <span>{resident.email}</span>
                                <span>{resident.phone}</span>
                              </div>
                              <div>CPF: {resident.cpf}</div>
                              {resident.currentUnit && (
                                <div className="text-blue-600">
                                  Atualmente na unidade {resident.currentUnit}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {resident.status !== "available" && (
                          <div className="text-sm text-muted-foreground">
                            {resident.status === "occupied" ? "Já possui unidade" : "Conta bloqueada"}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredResidents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum morador encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros de busca</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DrawerFooter>
            <div className="flex gap-2">
              {!unit?.currentTenant && selectedTenant && (
                <Button
                  onClick={handleAssignTenant}
                  disabled={isLoading}
                  className="flex-1 bg-teal-500 hover:bg-teal-600"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isLoading ? "Atribuindo..." : "Atribuir Morador"}
                </Button>
              )}
              
              {unit?.currentTenant && selectedTenant && (
                <Button
                  onClick={handleAssignTenant}
                  disabled={isLoading}
                  className="flex-1 bg-teal-500 hover:bg-teal-600"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {isLoading ? "Trocando..." : "Trocar Morador"}
                </Button>
              )}
              
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1" disabled={isLoading}>
                  Cancelar
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}