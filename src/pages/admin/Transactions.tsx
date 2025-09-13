import React, { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { StandardTable } from '@/components/ui/standard-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { MoneyCell } from '@/components/ui/money-cell'
import { DateCell } from '@/components/ui/date-cell'
import { ActionsMenu, ActionItem } from '@/components/ui/actions-menu'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Receipt, 
  CreditCard,
  TrendingUp,
  TrendingDown,
  FileText,
  BarChart3
} from 'lucide-react'

interface Transaction {
  id: number
  date: string
  description: string
  resident: string
  unit: string
  type: 'Receita' | 'Despesa'
  category: string
  amount: string
  status: 'Pago' | 'Pendente' | 'Atrasado' | 'Cancelado'
  paymentMethod: string
}

const transactionsData: Transaction[] = [
  { id: 1, date: "15/12/2024", description: "Pagamento de Aluguel - Dezembro", resident: "João da Silva", unit: "101", type: "Receita", category: "Aluguel", amount: "800,00", status: "Pago", paymentMethod: "PIX" },
  { id: 2, date: "14/12/2024", description: "Pagamento de Aluguel - Dezembro", resident: "Ana Oliveira", unit: "203", type: "Receita", category: "Aluguel", amount: "1300,00", status: "Pago", paymentMethod: "Transferência" },
  { id: 3, date: "13/12/2024", description: "Manutenção Hidráulica - Unidade 204", resident: "Carlos Lima", unit: "204", type: "Despesa", category: "Manutenção", amount: "250,00", status: "Pago", paymentMethod: "Dinheiro" },
  { id: 4, date: "12/12/2024", description: "Pagamento de Aluguel - Dezembro", resident: "Pedro Costa", unit: "201", type: "Receita", category: "Aluguel", amount: "1200,00", status: "Pago", paymentMethod: "Boleto" },
  { id: 5, date: "11/12/2024", description: "Taxa de Condomínio - Dezembro", resident: "Fernanda Rocha", unit: "302", type: "Receita", category: "Taxa", amount: "150,00", status: "Pendente", paymentMethod: "" },
  { id: 6, date: "10/12/2024", description: "Pagamento de Aluguel - Dezembro", resident: "Maria Santos", unit: "103", type: "Receita", category: "Aluguel", amount: "900,00", status: "Atrasado", paymentMethod: "" },
  { id: 7, date: "08/12/2024", description: "Limpeza das Áreas Comuns", resident: "", unit: "", type: "Despesa", category: "Limpeza", amount: "300,00", status: "Pago", paymentMethod: "Transferência" },
  { id: 8, date: "05/12/2024", description: "Multa por Atraso - Novembro", resident: "Roberto Dias", unit: "303", type: "Receita", category: "Multa", amount: "45,00", status: "Cancelado", paymentMethod: "" },
  { id: 9, date: "03/12/2024", description: "Reparo Elétrico - Unidade 102", resident: "", unit: "102", type: "Despesa", category: "Manutenção", amount: "180,00", status: "Pago", paymentMethod: "PIX" },
  { id: 10, date: "01/12/2024", description: "Taxa de Administração - Dezembro", resident: "", unit: "", type: "Despesa", category: "Administração", amount: "500,00", status: "Pago", paymentMethod: "Transferência" }
]

export default function TransactionsPage() {
  const [loading, setLoading] = useState(false)

  const columns: ColumnDef<Transaction>[] = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Selecionar todos"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar linha"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'date',
      header: 'Data',
      cell: ({ row }) => (
        <DateCell value={row.original.date} />
      ),
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="font-medium truncate">{row.original.description}</div>
          {row.original.resident && (
            <div className="text-xs text-muted-foreground truncate">
              {row.original.resident} - {row.original.unit}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => {
        const type = row.original.type
        return (
          <div className="flex items-center gap-2">
            {type === 'Receita' ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <Badge 
              variant={type === 'Receita' ? 'statusActive' : 'dangerAlt'}
            >
              {type}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: 'category',
      header: 'Categoria',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.category}</Badge>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Valor',
      cell: ({ row }) => (
        <MoneyCell 
          value={row.original.amount.replace(',', '.')}
          variant={row.original.type === 'Receita' ? 'positive' : 'negative'}
        />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Método',
      cell: ({ row }) => {
        const method = row.original.paymentMethod;
        
        if (!method) {
          return <span className="text-muted-foreground text-sm">-</span>;
        }
        
        const getMethodVariant = (method: string) => {
          switch (method) {
            case 'PIX': return 'infoAlt';
            case 'Transferência': return 'statusActive';
            case 'Dinheiro': return 'warningAlt';
            case 'Boleto': return 'premium';
            default: return 'statusDraft';
          }
        };
        
        return (
          <Badge variant={getMethodVariant(method) as any}>
            {method}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const transaction = row.original
        
        const getActions = (): ActionItem[] => {
          const baseActions: ActionItem[] = [
            {
              label: 'Ver detalhes',
              icon: Eye,
              onClick: () => console.log('Ver detalhes da transação:', transaction.id),
            },
            {
              label: 'Editar',
              icon: Edit,
              onClick: () => console.log('Editar transação:', transaction.id),
            }
          ]

          // Ações específicas por status
          if (transaction.status === 'Pago') {
            baseActions.push({
              label: 'Baixar comprovante',
              icon: Receipt,
              onClick: () => console.log('Baixar comprovante:', transaction.id),
              separator: true,
            })
          } else if (transaction.status === 'Pendente' || transaction.status === 'Atrasado') {
            baseActions.push({
              label: 'Registrar pagamento',
              icon: CreditCard,
              onClick: () => console.log('Registrar pagamento:', transaction.id),
              separator: true,
            })
          }

          baseActions.push({
            label: 'Excluir',
            icon: Trash2,
            onClick: () => handleDelete(transaction.id),
            variant: 'destructive',
          })

          return baseActions
        }

        return (
          <div className="flex justify-end">
            <ActionsMenu actions={getActions()} />
          </div>
        )
      },
    },
  ], [])

  const handleDelete = (id: number) => {
    console.log('Excluir transação:', id)
    // Implementar lógica de exclusão
  }

  const handleAdd = () => {
    console.log('Adicionar nova transação')
    // Implementar lógica de adição
  }

  const filterOptions = [
    {
      label: 'Filtrar por tipo',
      value: 'Receita,Despesa',
      key: 'type'
    },
    {
      label: 'Filtrar por status',
      value: 'Pago,Pendente,Atrasado,Cancelado',
      key: 'status'
    },
    {
      label: 'Filtrar por categoria',
      value: 'Aluguel,Taxa,Manutenção,Limpeza,Administração,Multa',
      key: 'category'
    }
  ]

  // Calcular totais
  const totals = useMemo(() => {
    const totalReceitas = transactionsData
      .filter(t => t.type === 'Receita' && t.status === 'Pago')
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(',', '.')), 0)
    
    const totalDespesas = transactionsData
      .filter(t => t.type === 'Despesa' && t.status === 'Pago')
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(',', '.')), 0)

    return {
      receitas: totalReceitas,
      despesas: totalDespesas,
      saldo: totalReceitas - totalDespesas
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Controle financeiro completo - receitas e despesas
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receitas</p>
              <MoneyCell value={totals.receitas} variant="positive" className="text-2xl font-bold" />
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Despesas</p>
              <MoneyCell value={totals.despesas} variant="negative" className="text-2xl font-bold" />
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo</p>
              <MoneyCell 
                value={totals.saldo} 
                variant={totals.saldo >= 0 ? 'positive' : 'negative'} 
                className="text-2xl font-bold" 
              />
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <StandardTable
        columns={columns}
        data={transactionsData}
        loading={loading}
        searchPlaceholder="Buscar por descrição, morador ou unidade..."
        searchKey="description"
        filterOptions={filterOptions}
        onAdd={handleAdd}
        addButtonLabel="Nova Transação"
        enableSelection={true}
        getCardTitle={(transaction) => transaction.description}
        getCardSubtitle={(transaction) => 
          transaction.resident ? `${transaction.resident} - Unidade ${transaction.unit}` : 'Transação geral'
        }
        getCardFields={(transaction) => [
          { label: 'Data', value: transaction.date, type: 'date' },
          { label: 'Tipo', value: transaction.type, type: 'badge' },
          { label: 'Categoria', value: transaction.category, type: 'badge' },
          { label: 'Valor', value: `R$ ${transaction.amount}`, type: 'currency' },
          { label: 'Status', value: transaction.status, type: 'status' },
          { label: 'Método', value: transaction.paymentMethod || 'Não informado' }
        ]}
        getCardActions={(transaction) => [
          {
            label: 'Ver detalhes',
            icon: Eye,
            onClick: () => console.log('Ver detalhes:', transaction.id)
          },
          {
            label: 'Editar',
            icon: Edit,
            onClick: () => console.log('Editar:', transaction.id)
          }
        ]}
        emptyMessage="Nenhuma transação encontrada."
      />
    </div>
  )
}