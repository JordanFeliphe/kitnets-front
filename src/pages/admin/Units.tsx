import React, { useState } from 'react'
import { UnitsTable } from '@/components/tables/UnitsTable'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

// Dados de exemplo (ajustados para o schema da UnitsTable)
const unitsData = [
  { 
    id: 1, 
    number: "101", 
    type: "Kitnet", 
    area: "25", 
    rent: "800,00", 
    status: "Ocupada", 
    resident: "João Silva", 
    lastPayment: "15/12/2024",
    floor: 1,
    description: "Kitnet com vista para a rua"
  },
  { 
    id: 2, 
    number: "102", 
    type: "Kitnet", 
    area: "25", 
    rent: "800,00", 
    status: "Vazia", 
    resident: "", 
    lastPayment: "",
    floor: 1,
    description: "Kitnet recém reformada"
  },
  { 
    id: 3, 
    number: "103", 
    type: "Kitnet", 
    area: "30", 
    rent: "900,00", 
    status: "Ocupada", 
    resident: "Maria Santos", 
    lastPayment: "10/12/2024",
    floor: 1,
    description: "Kitnet ampla com varanda"
  },
  { 
    id: 4, 
    number: "104", 
    type: "Kitnet", 
    area: "25", 
    rent: "800,00", 
    status: "Manutenção", 
    resident: "", 
    lastPayment: "",
    floor: 1,
    description: "Em manutenção - troca de piso"
  },
  { 
    id: 5, 
    number: "201", 
    type: "Apartamento", 
    area: "45", 
    rent: "1200,00", 
    status: "Ocupada", 
    resident: "Pedro Costa", 
    lastPayment: "12/12/2024",
    floor: 2,
    description: "Apartamento com 2 quartos"
  },
  { 
    id: 6, 
    number: "202", 
    type: "Apartamento", 
    area: "45", 
    rent: "1200,00", 
    status: "Vazia", 
    resident: "", 
    lastPayment: "",
    floor: 2,
    description: "Apartamento com sacada"
  },
  { 
    id: 7, 
    number: "203", 
    type: "Apartamento", 
    area: "50", 
    rent: "1300,00", 
    status: "Ocupada", 
    resident: "Ana Oliveira", 
    lastPayment: "14/12/2024",
    floor: 2,
    description: "Apartamento premium"
  },
  { 
    id: 8, 
    number: "204", 
    type: "Kitnet", 
    area: "28", 
    rent: "850,00", 
    status: "Ocupada", 
    resident: "Carlos Lima", 
    lastPayment: "11/12/2024",
    floor: 2,
    description: "Kitnet com área de serviço"
  },
  { 
    id: 9, 
    number: "301", 
    type: "Apartamento", 
    area: "55", 
    rent: "1400,00", 
    status: "Vazia", 
    resident: "", 
    lastPayment: "",
    floor: 3,
    description: "Cobertura com terraço"
  },
  { 
    id: 10, 
    number: "302", 
    type: "Apartamento", 
    area: "55", 
    rent: "1400,00", 
    status: "Ocupada", 
    resident: "Fernanda Rocha", 
    lastPayment: "16/12/2024",
    floor: 3,
    description: "Apartamento com vista panorâmica"
  },
  { 
    id: 11, 
    number: "303", 
    type: "Kitnet", 
    area: "30", 
    rent: "900,00", 
    status: "Ocupada", 
    resident: "Roberto Dias", 
    lastPayment: "13/12/2024",
    floor: 3,
    description: "Kitnet com móveis planejados"
  },
  { 
    id: 12, 
    number: "304", 
    type: "Kitnet", 
    area: "27", 
    rent: "850,00", 
    status: "Vazia", 
    resident: "", 
    lastPayment: "",
    floor: 3,
    description: "Kitnet com ar condicionado"
  }
]

export default function UnitsPage() {
  const [shouldOpenNewUnit, setShouldOpenNewUnit] = useState(false)

  const handleNewUnit = () => {
    console.log("Nova unidade clicada")
    setShouldOpenNewUnit(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Unidades</h1>
          <p className="text-muted-foreground">
            Gerencie todas as unidades do condomínio
          </p>
        </div>
        <Button onClick={handleNewUnit}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nova Unidade
        </Button>
      </div>

      <UnitsTable 
        data={unitsData} 
        shouldOpenNewUnit={shouldOpenNewUnit}
        onNewUnitOpened={() => setShouldOpenNewUnit(false)}
      />
    </div>
  )
}