import { useState } from 'react'
import { UnitsTable } from './components/UnitsTable'
import { useAdminUnits } from './hooks/useUnits'
import { Button } from '@/app/shared/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from '@/app/shared/components/ui/breadcrumb'


export default function UnitsPage() {
  const [, setShouldOpenNewUnit] = useState(false)
  const [page] = useState(1)
  const [limit] = useState(10)

  const { data: apiResponse, isLoading, error } = useAdminUnits(page, limit)

  const handleNewUnit = () => {
    setShouldOpenNewUnit(true)
  }

  // Handle different possible response formats
  const units = Array.isArray(apiResponse)
    ? apiResponse
    : (apiResponse as any)?.data && Array.isArray((apiResponse as any).data)
    ? (apiResponse as any).data
    : (apiResponse as any)?.units && Array.isArray((apiResponse as any).units)
    ? (apiResponse as any).units
    : []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Unidades</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando unidades...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Unidades</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar unidades</p>
            <p className="text-gray-600 mt-2">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  // Transform API data to match the table format
  const tableData = units.map((unit: any) => ({
    id: unit._id,
    number: unit.code,
    type: "Unidade", // API doesn't provide type, using default
    area: "-", // API doesn't provide area
    rent: unit.rentDefaultAmount?.toLocaleString?.('pt-BR', { style: 'currency', currency: 'BRL' }) || '-',
    status: unit.status === 'AVAILABLE' ? 'Disponível' :
            unit.status === 'OCCUPIED' ? 'Ocupada' : 'Manutenção',
    resident: unit.tenant?.name || "",
    lastPayment: unit.tenant ? "-" : "", // Would need payment data from API
    floor: 1, // API doesn't provide floor, using default
    description: unit.notes || ""
  }))

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Unidades</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Unidades</h1>
          <p className="text-muted-foreground">
            Gerencie todas as unidades do condomínio
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button onClick={handleNewUnit}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nova Unidade
          </Button>
        </div>
      </div>

      <UnitsTable
        data={tableData}
        onAdd={handleNewUnit}
      />
    </div>
  )
}