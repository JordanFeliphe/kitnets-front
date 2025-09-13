import * as React from "react"
import {
  BuildingIcon,
  ClipboardListIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  ReceiptIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigationData = {
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
      title: "Usuários",
      url: "/admin/users",
      icon: UserCheckIcon,
    },
    {
      title: "Relatórios",
      url: "/admin/reports",
      icon: ClipboardListIcon,
    },
    {
      title: "Logs",
      url: "/admin/logs",
      icon: FileTextIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  
  const userData = {
    name: user?.name || "Usuário",
    email: user?.email || "usuario@kitnetes.com",
    avatar: user?.avatar || "/avatars/default.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <HomeIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Res. Rubim</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        <NavSecondary items={navigationData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
