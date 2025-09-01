import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Users,
  CreditCard,
  Home,
  DollarSign,
  Clock,
  AlertCircle,
  CalendarCheck,
  ReceiptText,
} from "lucide-react"
import { ChartAreaInteractive } from "@/components/charts/ChartAreaInteractive"
import { HouseRadialChart } from "@/components/charts/HouseRadialChart"

export default function AdminDashboard() {
  const currentTotalRevenue = 15231.89

  const alugueisPagos = 285
  const alugueisAtrasados = 25
  const valorAlugueisAtrasados = 8500.0
  const alugueisProximoVencimento = 50
  const casasVazias = 20
  const casasAlugadas = 290

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="details">Detalhes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <ChartAreaInteractive />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HouseRadialChart
            title="Casas Vazias"
            value={casasVazias}
            colorVar="hsl(var(--chart-2))"
          />
          <HouseRadialChart
            title="Casas Alugadas"
            value={casasAlugadas}
            colorVar="hsl(var(--chart-2))"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Receita</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R${currentTotalRevenue.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">Valor acumulado</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Moradores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250</div>
              <p className="text-xs text-muted-foreground">Atualmente registrados</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Boletos Pagos</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
              <p className="text-xs text-muted-foreground">+20 desde o mês passado</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidades Ativas</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">310</div>
              <p className="text-xs text-muted-foreground">Com contratos ativos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aluguéis Pagos</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alugueisPagos}</div>
              <p className="text-xs text-muted-foreground">Este mês (até agora)</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aluguéis Atrasados</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{alugueisAtrasados}</div>
              <p className="text-xs text-muted-foreground">Unidades com atraso</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Atrasado</CardTitle>
              <ReceiptText className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                R${valorAlugueisAtrasados.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">Total a receber</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Vencimentos</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alugueisProximoVencimento}</div>
              <p className="text-xs text-muted-foreground">Nos próximos 7 dias</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="details">
        {/* Conteúdo da aba de detalhes */}
      </TabsContent>
    </Tabs>
  )
}
