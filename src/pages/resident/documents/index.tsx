import { useState, useCallback } from "react"
import { Card, CardContent } from "@/app/shared/components/ui/card"
import { Button } from "@/app/shared/components/ui/button"
import { StatusBadge } from "@/app/shared/components/ui/status-badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from '@/app/shared/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/shared/components/ui/dropdown-menu"
import {
  Download,
  Eye,
  MoreVertical,
  FileCheck,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react"
import { toast } from "sonner"

// Dados do contrato único do morador
const contractData = {
  id: 1,
  numero: "CT-2024-001",
  nome: "Contrato de Locação - Unidade 101",
  arquivo: "contrato-locacao-unidade-101.pdf",
  dataUpload: "01/01/2024",
  dataValidade: "31/12/2024",
  status: "Ativo" as "Ativo" | "Pendente de Assinatura" | "Expirado",
  versao: "1.2",
  tamanho: "2.4 MB",
  obrigatorio: true,
  descricao: "Contrato principal de locação da unidade 101, com prazo de vigência de 12 meses."
}


const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Ativo':
      return <CheckCircle className="h-4 w-4" />
    case 'Pendente de Assinatura':
      return <Clock className="h-4 w-4" />
    case 'Expirado':
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <FileCheck className="h-4 w-4" />
  }
}

export default function ResidentDocuments() {
  const [showDetails, setShowDetails] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString.split('/').reverse().join('-')).toLocaleDateString('pt-BR')
  }

  const handleDownloadContract = useCallback(() => {
    toast.success(`Baixando ${contractData.arquivo}...`)
  }, [])

  const handleViewDetails = useCallback(() => {
    setShowDetails(!showDetails)
  }, [showDetails])

  const handleSignContract = useCallback(() => {
    toast.success("Redirecionando para assinatura do contrato...")
  }, [])

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/resident">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Documentos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Contrato</h1>
          <p className="text-muted-foreground">
            Acesse, baixe e gerencie o seu contrato de locação
          </p>
        </div>
      </div>

      {/* Contract Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <FileCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">{contractData.nome}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {contractData.arquivo}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={contractData.status} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    aria-label="Abrir menu de ações"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={handleViewDetails}
                    className="cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDownloadContract}
                    className="cursor-pointer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar contrato (PDF)
                  </DropdownMenuItem>
                  {contractData.status === 'Pendente de Assinatura' && (
                    <DropdownMenuItem
                      onClick={handleSignContract}
                      className="cursor-pointer"
                    >
                      <FileCheck className="mr-2 h-4 w-4" />
                      Assinar contrato
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Número</p>
              <p className="font-medium">{contractData.numero}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Data de Upload</p>
              <p className="font-medium">{formatDate(contractData.dataUpload)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Validade</p>
              <p className="font-medium">{formatDate(contractData.dataValidade)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tamanho</p>
              <p className="font-medium">{contractData.tamanho}</p>
            </div>
          </div>

          {/* Details Section */}
          {showDetails && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-sm mb-3">Detalhes do Contrato</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Número do contrato</p>
                  <p className="font-medium">{contractData.numero}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Versão</p>
                  <p className="font-medium">v{contractData.versao}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data de upload</p>
                  <p className="font-medium">{formatDate(contractData.dataUpload)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data de validade</p>
                  <p className="font-medium">{formatDate(contractData.dataValidade)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Obrigatório</p>
                  <p className="font-medium">{contractData.obrigatorio ? "Sim" : "Não"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(contractData.status)}
                    <span className="font-medium">{contractData.status}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-muted-foreground text-sm">Descrição</p>
                <p className="text-sm mt-1">{contractData.descricao}</p>
              </div>
            </div>
          )}

          {/* Mobile Actions */}
          <div className="mt-4 flex gap-2 md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadContract}
              className="flex-1"
            >
              <Download className="h-3 w-3 mr-2" />
              Baixar
            </Button>
            {contractData.status === 'Pendente de Assinatura' && (
              <Button
                size="sm"
                onClick={handleSignContract}
                className="flex-1"
              >
                <FileCheck className="h-3 w-3 mr-2" />
                Assinar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}