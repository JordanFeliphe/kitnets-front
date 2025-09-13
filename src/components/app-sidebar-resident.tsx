import * as React from "react"
import {
  CreditCardIcon,
  FileStackIcon,
  FileTextIcon,
  HomeIcon,
  UserIcon,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

import { NavMain } from "@/components/nav-main"
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

const residentNavigationData = {
  navMain: [
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
      icon: FileTextIcon,
    },
    {
      title: "Documentos",
      url: "/resident/documents",
      icon: FileStackIcon,
    },
  ],
}

export function AppSidebarResident({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  
  const userData = {
    name: user?.name || "Morador",
    email: user?.email || "morador@kitnetes.com",
    avatar: user?.avatar || "/avatars/default.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-0"
            >
              <a href="/resident" className="flex items-center gap-3 rounded-lg bg-sidebar hover:bg-sidebar-accent/50 p-4 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                  <HomeIcon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">Res Rubim</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavMain items={residentNavigationData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}