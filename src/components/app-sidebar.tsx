import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,

  User2,
  CreditCard,
  ReceiptText,
 
  Settings2,
  FileSignature,

  ChevronDown,
  LogOut,
  MoreVertical,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const data = {
  navMain: [
    {
      title: "Início",
      icon: <LayoutDashboard className="size-4" />,
      url: "/admin",
    },
    {
      title: "Moradores",
      icon: <User2 className="size-4" />,
      url: "/admin/residents",
    },
    {
      title: "Pagamentos", 
      icon: <CreditCard className="size-4" />,
      url: "/admin/payments",
    },
    {
      title: "Receitas",
      icon: <ReceiptText className="size-4" />,
      url: "/revenues",
    },

    {
      title: "Documentos",
      icon: <FileSignature className="size-4" />,
      url: "/documents",
    },
    {
      title: "Configurações",
      icon: <Settings2 className="size-4" />,
      items: [
        { title: "Usuários", url: "/settings/users" },
        { title: "Permissões", url: "/settings/permissions" },
        { title: "Acessos", url: "/settings/access" },
      ],
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  return (
    <Sidebar
      {...props}
      className="min-w-[240px] bg-sidebar px-4 py-6 shadow-md border-r border-sidebar-border rounded-tr-2xl rounded-br-2xl font-sans"
    >
      <SidebarHeader className="mb-6 px-2">
        <span className="text-xl font-semibold tracking-tight text-sidebar-foreground">
          Residencial Rubim
        </span>
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between h-full">
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isParentActive = item.items?.some(
                (sub) => sub.url === location.pathname
              );
              return item.items ? (
                <Collapsible key={item.title}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton isActive={isParentActive}>
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown className="size-4 opacity-70" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                  <CollapsibleContent>
                    {item.items.map((sub) => {
                      const isActive = location.pathname === sub.url;
                      return (
                        <SidebarMenuItem key={sub.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className="ml-8"
                          >
                            <a href={sub.url}>{sub.title}</a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <a href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#" className="flex items-center gap-2">
                  <Avatar className="h-9 w-9 border border-solid border-border">
                    <AvatarImage src="/avatar.png" alt="@user" />
                    <AvatarFallback>RB</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium text-sidebar-foreground">
                      Rubens Braga
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      m@example.com
                    </span>
                  </div>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction>
                    <MoreVertical className="h-4 w-4" />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem>Account</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Notifications</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
