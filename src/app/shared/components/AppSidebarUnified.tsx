import * as React from "react"
import {
  BuildingIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  ReceiptIcon,
  UsersIcon,
  UserIcon,
  FileStackIcon,
} from "lucide-react"
import { useAuth } from "@/app/shared/contexts/AuthContext"

import { NavMain } from "@/app/shared/components/nav-main"
import { NavSecondary } from "@/app/shared/components/nav-secondary"
import { NavUser } from "@/app/shared/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/shared/components/ui/sidebar"

// Admin navigation
const adminNavigationData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Unidades",
      url: "/admin/units",
      icon: BuildingIcon,
    },
    {
      title: "Moradores",
      url: "/admin/residents",
      icon: UsersIcon,
    },
    {
      title: "Contratos",
      url: "/admin/leases",
      icon: FileTextIcon,
    },
    {
      title: "Transações",
      url: "/admin/transactions",
      icon: CreditCardIcon,
    },
    {
      title: "Pagamentos",
      url: "/admin/payments",
      icon: ReceiptIcon,
    },
  ],
  navSecondary: [
    {
      title: "Logs",
      url: "/admin/logs",
      icon: FileTextIcon,
    },
  ],
}

// Resident navigation
const residentNavigationData = {
  navMain: [
    {
      title: "Início",
      url: "/resident",
      icon: HomeIcon,
    },
    {
      title: "Meus Dados",
      url: "/resident/profile",
      icon: UserIcon,
    },
    {
      title: "Meus Pagamentos",
      url: "/resident/payments",
      icon: CreditCardIcon,
    },
    {
      title: "Boletos",
      url: "/resident/invoices",
      icon: ReceiptIcon,
    },
    {
      title: "Documentos",
      url: "/resident/documents",
      icon: FileStackIcon,
    },
  ],
  navSecondary: [],
}

export function AppSidebarUnified({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const userData = {
    name: user?.name || "Usuário",
    email: user?.email || "usuario@kitnetes.com",
    avatar: "/avatars/default.jpg",
  }

  // Determine navigation based on user type
  const isAdmin = user?.type === 'ADMIN'
  const navigationData = isAdmin ? adminNavigationData : residentNavigationData
  const homeUrl = isAdmin ? "/admin" : "/resident"

  return (
    <Sidebar collapsible="offcanvas" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href={homeUrl}>
                <HomeIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Res. Rubim</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        {navigationData.navSecondary.length > 0 && (
          <NavSecondary items={navigationData.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}