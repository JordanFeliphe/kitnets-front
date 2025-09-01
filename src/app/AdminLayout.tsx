import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle/ThemeToggle";

const AdminLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sidebar font-sans">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button> 
              </SidebarTrigger>
           
            </div>

            <ThemeToggle />
          </header>
          <main className="flex-1 p-6 bg-muted/40">
            <Outlet />
          </main>
        </div>"Políticas"
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
