import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin') return 'Dashboard'
    if (pathname === '/admin/units') return 'Unidades'
    if (pathname === '/admin/residents') return 'Moradores'
    if (pathname === '/admin/leases') return 'Contratos'
    if (pathname === '/admin/transactions') return 'Transações'
    if (pathname === '/admin/payments') return 'Pagamentos'
    if (pathname === '/admin/users') return 'Usuários'
    if (pathname === '/admin/reports') return 'Relatórios'
    if (pathname === '/admin/permissions') return 'Permissões'
    if (pathname === '/admin/system') return 'Sistema'
    return 'Administração'
  }
  
  if (pathname.startsWith('/resident')) {
    if (pathname === '/resident') return 'Portal do Morador'
    if (pathname === '/resident/profile') return 'Meus Dados'
    if (pathname === '/resident/payments') return 'Meus Pagamentos'
    if (pathname === '/resident/invoices') return 'Boletos'
    if (pathname === '/resident/notices') return 'Avisos'
    if (pathname === '/resident/documents') return 'Documentos'
    return 'Portal do Morador'
  }
  
  return 'Dashboard'
}

export function SiteHeader() {
  const location = useLocation()
  const title = getPageTitle(location.pathname)
  
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
