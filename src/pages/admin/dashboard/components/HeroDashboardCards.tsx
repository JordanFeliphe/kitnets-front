import { Button } from "@/app/shared/components/ui/button"
import { Badge } from "@/app/shared/components/ui/badge"
import { ArrowRight, ExternalLink } from "lucide-react"
import bgCards from "@/assets/img/bg-cards.jpg"

interface HeroCardProps {
  title: string
  value: string | number
  subtitle: string
  description: string
  actionText: string
  onAction: () => void
  isExternalLink?: boolean
  badge?: {
    text: string
    variant: "default" | "secondary" | "destructive" | "outline"
  }
}

function HeroCard({
  title,
  value,
  subtitle,
  description,
  actionText,
  onAction,
  isExternalLink = false,
  badge
}: HeroCardProps) {
  return (
    <div
      className="relative rounded-xl border border-border/50 shadow-lg bg-cover bg-center overflow-hidden group hover:shadow-xl hover:border-border transition-all duration-300"
      style={{
        backgroundImage: `url(${bgCards})`
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60" />

      {/* Content */}
      <div className="relative z-10 p-6 text-white h-full min-h-[260px] flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {badge && (
              <Badge
                variant={badge.variant}
                className="bg-white/15 text-white border-white/25 hover:bg-white/25 backdrop-blur-sm shadow-sm transition-all duration-200"
              >
                {badge.text}
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {value}
            </div>
            <p className="text-sm text-white/80 font-medium">{subtitle}</p>
            <p className="text-xs text-white/70 leading-relaxed">{description}</p>
          </div>
        </div>

        <Button
          onClick={onAction}
          size="default"
          className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl font-medium group/btn"
        >
          <span className="flex items-center justify-center gap-2">
            {actionText}
            {isExternalLink ? (
              <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-200" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
            )}
          </span>
        </Button>
      </div>
    </div>
  )
}

interface HeroDashboardCardsProps {
  onNavigate: (path: string) => void
  dashboardData: {
    account: {
      status: string
      statusType: string
      unit: string
      contractEndDate: string
    }
    payments: {
      pending: number
      nextDue: string
    }
    documents: {
      available: number
    }
  }
}

export function HeroDashboardCards({ onNavigate, dashboardData }: HeroDashboardCardsProps) {
  const cards: Omit<HeroCardProps, 'onAction'>[] = [
    {
      title: "Status da Conta",
      value: dashboardData.account.status,
      subtitle: dashboardData.account.unit,
      description: `Contrato válido até ${dashboardData.account.contractEndDate}`,
      actionText: "Ver Detalhes",
      badge: {
        text: "Ativo",
        variant: "default"
      }
    },
    {
      title: "Pagamentos",
      value: dashboardData.payments.pending,
      subtitle: `Próximo vencimento ${dashboardData.payments.nextDue}`,
      description: dashboardData.payments.pending > 0
        ? "Você possui pagamentos pendentes que precisam de atenção"
        : "Todos os pagamentos estão em dia",
      actionText: dashboardData.payments.pending > 0 ? "Gerenciar Pagamentos" : "Ver Histórico",
      badge: dashboardData.payments.pending > 0 ? {
        text: "Pendente",
        variant: "destructive"
      } : {
        text: "Em dia",
        variant: "default"
      }
    },
    {
      title: "Equatorial Energia",
      value: "(98) 2055-0116",
      subtitle: "Segunda via de conta",
      description: "Atendimento via WhatsApp disponível para consultas e solicitações",
      actionText: "Abrir WhatsApp",
      isExternalLink: true,
      badge: {
        text: "24h",
        variant: "secondary"
      }
    },
    {
      title: "Documentos",
      value: dashboardData.documents.available,
      subtitle: "Contrato de locação",
      description: "Download disponível para contratos, comprovantes e outros documentos",
      actionText: "Ver Documentos",
      badge: {
        text: "Disponível",
        variant: "outline"
      }
    }
  ]

  const handleAction = (index: number) => {
    switch (index) {
      case 0:
        onNavigate("profile")
        break
      case 1:
        onNavigate("payments")
        break
      case 2:
        window.open("https://wa.me/559820550116", "_blank")
        break
      case 3:
        onNavigate("documents")
        break
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <HeroCard
          key={index}
          {...card}
          onAction={() => handleAction(index)}
        />
      ))}
    </div>
  )
}