import { Link } from 'react-router-dom'
import { useAuth } from '@/app/shared/contexts/AuthContext'
import { DashboardCard } from '@/pages/admin/dashboard/components/DashboardCard'

import { Badge } from '@/app/shared/components/ui/badge'
import { Card, CardContent } from '@/app/shared/components/ui/card'
import { Skeleton } from '@/app/shared/components/ui/skeleton'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/app/shared/components/ui/breadcrumb'
import { TooltipProvider } from '@/app/shared/components/ui/tooltip'

import type { LucideIcon } from 'lucide-react'
import {
  UserIcon,
  CreditCardIcon,
  FileTextIcon,
  BookOpenIcon,
} from 'lucide-react'

const QUICK_ACTIONS = [
  {
    id: 'meus-dados',
    title: 'Meus Dados',
    description: 'Informações pessoais',
    href: '/resident/profile',
    icon: UserIcon
  },
  {
    id: 'meus-pagamentos',
    title: 'Meus Pagamentos',
    description: 'Histórico e pendências',
    href: '/resident/payments',
    icon: CreditCardIcon
  },
  {
    id: 'boletos',
    title: 'Boletos',
    description: 'Gerar e baixar',
    href: '/resident/invoices',
    icon: FileTextIcon
  },
  {
    id: 'documentos',
    title: 'Documentos',
    description: 'Contratos e comprovantes',
    href: '/resident/documents',
    icon: FileTextIcon
  },
  {
    id: 'regulamento',
    title: 'Regulamento',
    description: 'Regras do condomínio',
    href: '/resident/documents/rules',
    icon: BookOpenIcon
  }
]


function QuickActionCard({ action }: { action: typeof QUICK_ACTIONS[0] }) {
  return (
    <Link to={action.href}>
      <Card className="rounded-2xl border-border/10 bg-card shadow-xs hover:shadow-sm transition-shadow cursor-pointer group">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
              <action.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium">{action.title}</h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function ResidentDashboard() {
  const { user } = useAuth()
  // Residents don't have dashboard API, use static data
  type DashboardCardData = {
    title: string
    value: string | number
    subtitle?: string
    variant?: 'default' | 'success' | 'warning' | 'error'
    icon?: LucideIcon
    trend?: { value: number; isPositive: boolean }
  }
  const dashboardData = null as DashboardCardData[] | null
  const dashboardLoading = false

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Início</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">
              Olá, {dashboardLoading ? <Skeleton className="inline-block h-6 w-24" /> : user?.name}
            </h1>
            {!dashboardLoading && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Apto 101
                </Badge>
                <Badge variant="default" className="text-xs">
                  Em dia
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border bg-card p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))
          ) : (
            dashboardData?.map((card, index) => (
              <DashboardCard
                key={index}
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                variant={card.variant}
                icon={card.icon}
                trend={card.trend}
              />
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Ações Rápidas</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>

      </div>
    </TooltipProvider>
  )
}