import { Outlet, Navigate } from "react-router-dom";
import { AppSidebarUnified } from "@/app/shared/components/AppSidebarUnified";
import { SiteHeader } from "@/app/shared/components/site-header";
import { SidebarInset, SidebarProvider } from "@/app/shared/components/ui/sidebar";
import { useAuth } from "@/app/shared/contexts/AuthContext";

const ResidentLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

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

  // Verificar se o usuário é realmente um morador
  if (user?.type !== 'RESIDENT') {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebarUnified />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ResidentLayout;