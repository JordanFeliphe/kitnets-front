import React, { useState, useMemo, useCallback } from "react"
import { DownloadIcon, RefreshCwIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogsTable, LogRow } from "@/components/tables/LogsTable"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

// Dados mock para demonstração
const mockLogs: LogRow[] = [
  {
    id: "1",
    timestamp: "2024-01-15T10:30:00Z",
    level: "info",
    message: "Usuário logado com sucesso",
    module: "Auth",
    user: "João Silva",
    ip: "192.168.1.100",
    action: "LOGIN"
  },
  {
    id: "2",
    timestamp: "2024-01-15T10:25:00Z",
    level: "warn",
    message: "Tentativa de login com credenciais inválidas",
    module: "Auth",
    user: "admin@test.com",
    ip: "192.168.1.101",
    action: "LOGIN_FAILED"
  },
  {
    id: "3",
    timestamp: "2024-01-15T10:20:00Z",
    level: "error",
    message: "Falha na conexão com banco de dados",
    module: "Database",
    ip: "192.168.1.50",
    action: "DATABASE_ERROR"
  },
  {
    id: "4",
    timestamp: "2024-01-15T10:15:00Z",
    level: "info",
    message: "Backup automático concluído",
    module: "System",
    action: "BACKUP_COMPLETED"
  },
  {
    id: "5",
    timestamp: "2024-01-15T10:10:00Z",
    level: "debug",
    message: "Cache invalidado para sessão do usuário",
    module: "Cache",
    user: "Maria Santos",
    ip: "192.168.1.102",
    action: "CACHE_INVALIDATED"
  },
  {
    id: "6",
    timestamp: "2024-01-15T10:05:00Z",
    level: "info",
    message: "Pagamento processado com sucesso",
    module: "Payments",
    user: "Pedro Costa",
    ip: "192.168.1.103",
    action: "PAYMENT_PROCESSED"
  },
  {
    id: "7",
    timestamp: "2024-01-15T10:00:00Z",
    level: "warn",
    message: "Limite de tentativas de login excedido",
    module: "Auth",
    ip: "192.168.1.200",
    action: "LOGIN_LIMIT_EXCEEDED"
  }
]

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogRow[]>(mockLogs)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [moduleFilter, setModuleFilter] = useState<string>("all")
  
  // Estatísticas dos logs
  const logStats = useMemo(() => ({
    total: logs.length,
    errors: logs.filter(log => log.level === "error").length,
    warnings: logs.filter(log => log.level === "warn").length,
    info: logs.filter(log => log.level === "info").length,
    debug: logs.filter(log => log.level === "debug").length
  }), [logs])

  // Filtrar logs baseado nos filtros ativos
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = searchQuery === "" || 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesLevel = levelFilter === "all" || log.level === levelFilter
      const matchesModule = moduleFilter === "all" || log.module === moduleFilter
      
      return matchesSearch && matchesLevel && matchesModule
    })
  }, [logs, searchQuery, levelFilter, moduleFilter])

  const handleRefresh = useCallback(() => {
    setLoading(true)
    toast.success("Atualizando logs...")
    // Simular carregamento
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const handleExport = useCallback((format: 'csv' | 'json') => {
    toast.success(`Exportando logs em formato ${format.toUpperCase()}`)
    console.log(`Exportando logs em formato ${format}`)
  }, [])

  const handleLogClick = useCallback((log: LogRow) => {
    console.log("Log clicado:", log)
    // Implementar abertura de modal ou drawer com detalhes
  }, [])

  const handleViewDetails = useCallback((log: LogRow) => {
    toast.success("Abrindo detalhes do log...")
    console.log("Ver detalhes do log:", log)
  }, [])

  const uniqueModules = useMemo(() => 
    Array.from(new Set(logs.map(log => log.module))), 
    [logs]
  )

  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setLevelFilter("all")
    setModuleFilter("all")
  }, [])

  const hasActiveFilters = searchQuery || levelFilter !== "all" || moduleFilter !== "all"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Logs do Sistema</h1>
          <p className="text-muted-foreground">
            Visualize e monitore os logs de atividades do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Exportar como CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Exportar como JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-lg border bg-card p-4">
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="rounded-lg border bg-card p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</p>
                <p className="text-2xl font-semibold text-foreground">{logStats.total}</p>
                <p className="text-xs text-muted-foreground">logs registrados</p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Erros</p>
                <p className="text-2xl font-semibold text-foreground">{logStats.errors}</p>
                <p className="text-xs text-muted-foreground">logs de erro</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avisos</p>
                <p className="text-2xl font-semibold text-foreground">{logStats.warnings}</p>
                <p className="text-xs text-muted-foreground">logs de aviso</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Informações</p>
                <p className="text-2xl font-semibold text-foreground">{logStats.info}</p>
                <p className="text-xs text-muted-foreground">logs informativos</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Debug</p>
                <p className="text-2xl font-semibold text-foreground">{logStats.debug}</p>
                <p className="text-xs text-muted-foreground">logs de debug</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por mensagem, usuário ou ação..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warn">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>

          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Módulo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os módulos</SelectItem>
              {uniqueModules.map(module => (
                <SelectItem key={module} value={module}>{module}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                Busca: {searchQuery}
              </Badge>
            )}
            {levelFilter !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Nível: {levelFilter}
              </Badge>
            )}
            {moduleFilter !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Módulo: {moduleFilter}
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Indicador de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredLogs.length} de {logs.length} logs
        </p>
      </div>

      {/* Tabela de Logs */}
      <LogsTable
        data={filteredLogs}
        loading={loading}
        onRowClick={handleLogClick}
        onViewDetails={handleViewDetails}
      />
    </div>
  )
}

export default LogsPage