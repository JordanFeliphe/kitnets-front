import { Outlet, Navigate } from "react-router-dom";
import { AppSidebarUnified } from "@/app/shared/components/AppSidebarUnified";
import { SiteHeader } from "@/app/shared/components/site-header";
import { SidebarInset, SidebarProvider } from "@/app/shared/components/ui/sidebar";
import { useAuth } from "@/app/shared/contexts/AuthContext";
import { NotificationProvider } from "@/app/shared/contexts/NotificationContext";
import { UIProvider } from "@/app/shared/contexts/UIContext";

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <UIProvider>
      <NotificationProvider>
        <SidebarProvider>
          <AppSidebarUnified />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="rounded-lg bg-card text-card-foreground shadow-sm border min-h-0 flex-1">
                <div className="p-6">
                  <Outlet />
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </NotificationProvider>
    </UIProvider>
  );
};

export default AdminLayout;
