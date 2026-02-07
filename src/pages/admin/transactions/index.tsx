import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { StandardTable } from '@/app/shared/components/ui/standard-table'
import { DateCell } from '@/app/shared/components/ui/date-cell'
import { ActionsMenu, ActionItem } from '@/app/shared/components/ui/actions-menu'
import { Checkbox } from '@/app/shared/components/ui/checkbox'
import { Button } from '@/app/shared/components/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from '@/app/shared/components/ui/breadcrumb'

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
  const [loading] = useState(false)

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
      cell: ({ row }) => (
        <span className="text-foreground font-medium">{row.original.type}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Categoria',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.category}</span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Valor',
      cell: ({ row }) => (
        <span className="text-foreground font-medium">R$ {row.original.amount}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className="text-foreground">{row.original.status}</span>
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
        
        return (
          <span className="text-muted-foreground text-sm">{method}</span>
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
              onClick: () => {},
            },
            {
              label: 'Editar',
              onClick: () => {},
            }
          ]

          // Ações específicas por status
          if (transaction.status === 'Pago') {
            baseActions.push({
              label: 'Baixar comprovante',
              onClick: () => {},
              separator: true,
            })
          } else if (transaction.status === 'Pendente' || transaction.status === 'Atrasado') {
            baseActions.push({
              label: 'Registrar pagamento',
              onClick: () => {},
              separator: true,
            })
          }

          baseActions.push({
            label: 'Excluir',
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

  const handleDelete = (_id: number) => {
  }

  const handleAdd = () => {
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
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Transações</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Controle financeiro completo - receitas e despesas
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" size="sm">
            Exportar
          </Button>
          <Button variant="outline" size="sm">
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
              <div className="text-2xl font-bold text-foreground">R$ {totals.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="text-muted-foreground text-xs">Receitas</div>
          </div>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Despesas</p>
              <div className="text-2xl font-bold text-foreground">R$ {totals.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="text-muted-foreground text-xs">Despesas</div>
          </div>
        </div>
        
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo</p>
              <div className="text-2xl font-bold text-foreground">R$ {totals.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="text-muted-foreground text-xs">Saldo</div>
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
          { label: 'Valor', value: `R$ ${transaction.amount}` },
          { label: 'Status', value: transaction.status, type: 'status' },
          { label: 'Método', value: transaction.paymentMethod || 'Não informado' }
        ]}
        getCardActions={(_transaction) => [
          {
            label: 'Ver detalhes',
            onClick: () => {}
          },
          {
            label: 'Editar',
            onClick: () => {}
          }
        ]}
        emptyMessage="Nenhuma transação encontrada."
      />
    </div>
  )
}