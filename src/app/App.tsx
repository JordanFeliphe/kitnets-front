import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import AdminLayout from "@/app/AdminLayout"
import ResidentLayout from "@/app/ResidentLayout"
import Dashboard from "@/pages/admin/dashboard/index"
import ResidentsPage from "@/pages/admin/residents/index"
import Payments from "@/pages/admin/payments/index"
import Users from "@/pages/admin/users/index"
import Login from "@/pages/auth/index"
import TermsOfService from "@/pages/public/TermsOfService"
import PrivacyPolicy from "@/pages/public/PrivacyPolicy"
import ResidentDashboard from "@/pages/resident/dashboard/index"
import ResidentProfile from "@/pages/resident/profile/index"
import ResidentPayments from "@/pages/resident/payments/index"
import ResidentInvoices from "@/pages/resident/invoices/index"
import ResidentDocuments from "@/pages/resident/documents/index"
import UnitsPage from "@/pages/admin/units/index"
import ContractsPage from "@/pages/admin/contracts/index"
import TransactionsPage from "@/pages/admin/transactions/index"
import ReportsPage from "@/pages/admin/reports/index"
import LogsPage from "@/pages/admin/logs/index"
import { ProtectedRoute } from "@/app/shared/components/ProtectedRoute"

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={
        <ProtectedRoute requireAuth={false}>
          <Login />
        </ProtectedRoute>
      } />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedUserTypes={['ADMIN']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="units" element={<UnitsPage />} />
        <Route path="residents" element={<ResidentsPage />} />
        <Route path="leases" element={<ContractsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="payments" element={<Payments />} />
        <Route path="users" element={<Users />} />
        <Route path="logs" element={<LogsPage />} />
      </Route>

      {/* Resident Routes */}
      <Route path="/resident" element={
        <ProtectedRoute allowedUserTypes={['RESIDENT']}>
          <ResidentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ResidentDashboard />} />
        <Route path="dashboard" element={<ResidentDashboard />} />
        <Route path="profile" element={<ResidentProfile />} />
        <Route path="payments" element={<ResidentPayments />} />
        <Route path="invoices" element={<ResidentInvoices />} />
        <Route path="documents" element={<ResidentDocuments />} />
        <Route path="documents/contract" element={<ResidentDocuments />} />
        <Route path="documents/receipts" element={<ResidentDocuments />} />
        <Route path="documents/rules" element={<ResidentDocuments />} />
        <Route path="notices" element={<ResidentDocuments />} />
      </Route>

      {/* Fallback routes */}
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}

export default App