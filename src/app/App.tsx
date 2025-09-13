import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import AdminLayout from "@/app/AdminLayout"
import ResidentLayout from "@/app/ResidentLayout"
import Dashboard from "@/page/dashboard/Dashboard"
import Residents from "@/page/residents/Residents"
import Payments from "@/page/payments/Payments"
import Users from "@/pages/users/Users"
import Auth from "@/pages/Auth"
import TermsOfService from "@/pages/TermsOfService"
import PrivacyPolicy from "@/pages/PrivacyPolicy"
import ResidentDashboard from "@/pages/resident/Dashboard"
import ResidentProfile from "@/pages/resident/Profile"
import ResidentPayments from "@/pages/resident/Payments"
import ResidentInvoices from "@/pages/resident/Invoices"
import ResidentDocuments from "@/pages/resident/Documents"
import UnitsPage from "@/pages/admin/Units"
import ContractsPage from "@/pages/admin/Contracts"
import TransactionsPage from "@/pages/admin/Transactions"
import ReportsPage from "@/pages/admin/Reports"
import LogsPage from "@/pages/admin/Logs"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute requireAuth={false}>
          <Auth />
        </ProtectedRoute>
      } />
      <Route path="/auth" element={
        <ProtectedRoute requireAuth={false}>
          <Auth />
        </ProtectedRoute>
      } />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {/* Resident Routes */}
      <Route path="/resident" element={
        <ProtectedRoute allowedRoles={['RESIDENT']}>
          <ResidentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ResidentDashboard />} />
        <Route path="profile" element={<ResidentProfile />} />
        <Route path="payments" element={<ResidentPayments />} />
        <Route path="invoices" element={<ResidentInvoices />} />
        <Route path="documents" element={<ResidentDocuments />} />
        <Route path="documents/contract" element={<ResidentDocuments />} />
        <Route path="documents/receipts" element={<ResidentDocuments />} />
        <Route path="documents/rules" element={<ResidentDocuments />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="units" element={<UnitsPage />} />
        <Route path="residents" element={<Residents />} />
        <Route path="leases" element={<ContractsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="payments" element={<Payments />} />
        <Route path="users" element={<Users />} />
        <Route path="logs" element={<LogsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
