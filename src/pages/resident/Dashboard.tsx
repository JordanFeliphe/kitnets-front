import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { 
  CreditCard, 
  FileText, 
  User, 
  Bell,
  Receipt,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Home,
  Calendar,
  Download,
  Settings,
  Users,
  Building,
  Megaphone,
  Clock
} from "lucide-react"

const dashboardData = {
  account: {
    status: "Ativo",
    statusType: "active",
    unit: "Unidade 101",
    contract: "CT-2024-001",
    contractEndDate: "31/12/2024"
  },
  payments: {
    pending: 2,
    nextDue: "15/01/2025",
    overdue: 0,
    totalPaid: 18500.00,
    lastPayment: "15/12/2024"
  },
  notices: {
    total: 3,
    unread: 1,
    recent: [
      { 
        id: 1, 
        title: "Manutenção do elevador", 
        date: "10/01/2025", 
        read: false, 
        priority: "high",
        category: "manutenção",
        time: "14:30"
      },
      { 
        id: 2, 
        title: "Assembleia geral marcada", 
        date: "08/01/2025", 
        read: true, 
        priority: "medium",
        category: "assembleia",
        time: "09:15"
      },
      { 
        id: 3, 
        title: "Nova área de lazer", 
        date: "05/01/2025", 
        read: true, 
        priority: "low",
        category: "melhorias",
        time: "16:45"
      }
    ]
  },
  documents: {
    available: 5,
    contracts: 1,
    receipts: 12,
    rules: 2,
    recent: ["Contrato de Locação", "Regulamento Interno", "Recibo - Dezembro 2024"]
  }
}

export default function ResidentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const getStatusVariant = (statusType: string) => {
    switch (statusType) {
      case 'active':
        return 'statusActive'
      case 'inactive':
        return 'statusInactive'
      case 'pending':
        return 'statusPending'
      default:
        return 'outline'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'manutenção':
        return <Settings className="h-4 w-4 text-orange-600" />
      case 'assembleia':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'melhorias':
        return <Building className="h-4 w-4 text-green-600" />
      case 'informativo':
        return <Bell className="h-4 w-4 text-purple-600" />
      case 'campanha':
        return <Megaphone className="h-4 w-4 text-pink-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const handleNavigate = (path: string) => {
    navigate(`/resident/${path}`)
  }

  return (
    <div className="space-y-6">
      {/* Header simplificado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Olá, {user?.name}</h1>
          <p className="text-muted-foreground">
            {dashboardData.account.unit} • <StatusBadge status="ativo" size="sm" />
          </p>
        </div>
      </div>

      {/* RESUMO RÁPIDO - Cards estilo admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="@container/card cursor-pointer rounded-xl"
          onClick={() => handleNavigate('profile')}
        >
          <CardHeader className="relative">
            <CardDescription>Status da Conta</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-teal-700 dark:text-teal-300">
              Ativa
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant={getStatusVariant(dashboardData.account.statusType)} className="text-xs">
                <CheckCircle className="size-3" />
                {dashboardData.account.status}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-teal-600 dark:text-teal-400">
              Conta em bom estado <CheckCircle className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {dashboardData.account.unit}
            </div>
          </CardFooter>
        </Card>

        <Card 
          className="@container/card cursor-pointer rounded-xl"
          onClick={() => handleNavigate('payments')}
        >
          <CardHeader className="relative">
            <CardDescription>Pagamentos Pendentes</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-amber-700 dark:text-amber-300">
              {dashboardData.payments.pending}
            </CardTitle>
            {dashboardData.payments.pending > 0 && (
              <div className="absolute right-4 top-4">
                <Badge variant="warning" className="flex gap-1 rounded-lg text-xs">
                  <AlertCircle className="size-3" />
                  Pendente
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-amber-600 dark:text-amber-400">
              Próximo vencimento <Calendar className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {dashboardData.payments.nextDue}
            </div>
          </CardFooter>
        </Card>

        <Card 
          className="@container/card cursor-pointer rounded-xl"
          onClick={() => handleNavigate('notices')}
        >
          <CardHeader className="relative">
            <CardDescription>Avisos Não Lidos</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-red-700 dark:text-red-300">
              {dashboardData.notices.unread}
            </CardTitle>
            {dashboardData.notices.unread > 0 && (
              <div className="absolute right-4 top-4">
                <Badge variant="destructive" className="flex gap-1 rounded-lg text-xs">
                  <Bell className="size-3" />
                  Novo
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-red-600 dark:text-red-400">
              Comunicados importantes <Bell className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {dashboardData.notices.total} avisos totais
            </div>
          </CardFooter>
        </Card>

        <Card 
          className="@container/card cursor-pointer rounded-xl"
          onClick={() => handleNavigate('documents')}
        >
          <CardHeader className="relative">
            <CardDescription>Documentos Disponíveis</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-blue-700 dark:text-blue-300">
              {dashboardData.documents.available}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="infoAlt" className="flex gap-1 rounded-lg text-xs">
                <FileText className="size-3" />
                Docs
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-blue-600 dark:text-blue-400">
              Contratos e comprovantes <FileText className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Acesso total liberado
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* AÇÕES RÁPIDAS - Cards com tema */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            className="@container/card cursor-pointer rounded-xl"
            onClick={() => handleNavigate('profile')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Meus Dados</CardTitle>
                <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <CardDescription>
                Atualizar informações pessoais
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="@container/card cursor-pointer rounded-xl"
            onClick={() => handleNavigate('payments')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Meus Pagamentos</CardTitle>
                  {dashboardData.payments.pending > 0 && (
                    <Badge variant="warning" className="h-2 w-2 p-0 border-none"></Badge>
                  )}
                </div>
                <CreditCard className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <CardDescription>
                Histórico e comprovantes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="@container/card cursor-pointer rounded-xl"
            onClick={() => handleNavigate('invoices')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Boletos</CardTitle>
                <Receipt className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <CardDescription>
                Baixar e imprimir
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="@container/card cursor-pointer rounded-xl"
            onClick={() => handleNavigate('documents')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Documentos</CardTitle>
                <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <CardDescription>
                Contratos e comprovantes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="@container/card cursor-pointer rounded-xl"
            onClick={() => handleNavigate('notices')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium group-hover:text-teal-700 dark:group-hover:text-teal-300">Avisos</CardTitle>
                  {dashboardData.notices.unread > 0 && (
                    <Badge variant="destructive" className="h-2 w-2 p-0 border-none"></Badge>
                  )}
                </div>
                <Bell className="h-4 w-4 text-teal-600 group-hover:text-teal-700 dark:text-teal-400 dark:group-hover:text-teal-300" />
              </div>
              <CardDescription>
                Comunicados importantes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="@container/card cursor-pointer rounded-xl"
            onClick={() => handleNavigate('rules')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium group-hover:text-teal-700 dark:group-hover:text-teal-300">Regulamento</CardTitle>
                <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <CardDescription>
                Normas de convivência
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* ATIVIDADES RECENTES - Card com lista */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Atividades Recentes</h2>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-base">Últimas Notificações</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {dashboardData.notices.recent.slice(0, 3).map((notice, index) => (
                <div 
                  key={notice.id} 
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleNavigate('notices')}
                >
                  <div className="flex items-start gap-3">
                    {/* Priority indicator */}
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notice.priority === 'high' ? 'bg-destructive' :
                      notice.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-primary'
                    }`}></div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-sm font-medium ${!notice.read ? 'font-semibold' : ''}`}>
                          {notice.title}
                        </h4>
                        <Badge variant={notice.priority === 'high' ? 'destructive' : notice.priority === 'medium' ? 'warning' : 'secondary'} className="text-xs">
                          {notice.priority === 'high' ? 'Alta' : notice.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{notice.date}</span>
                        <span>{notice.time}</span>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <Button 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => handleNavigate('notices')}
              >
                Ver Todos os Avisos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}