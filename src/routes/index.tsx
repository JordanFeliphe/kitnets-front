import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Login = lazy(() => import("@/page/login/Login"));
const AdminLayout = lazy(() => import("@/app/AdminLayout"));
const AdminDashboard = lazy(() => import("@/page/dashboard/Dashboard"));
const Residents = lazy(() => import("@/page/residents/Residents"));
const Payments = lazy(() => import("@/page/payments/Payments"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="loading-screen">Carregando...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Rota para /payments no nível raiz, se necessário */}
        <Route path="/payments" element={<Payments />} /> {/* <--- Adicione esta linha se precisar de /payments diretamente */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="residents" element={<Residents />} />
          <Route path="payments" element={<Payments />} /> {/* Esta rota é para /admin/payments */}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;