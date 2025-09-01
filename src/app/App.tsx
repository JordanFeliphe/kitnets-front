import React from "react"
import { Routes, Route } from "react-router-dom"
import Login from "@/page/login/Login"
import AdminLayout from "@/app/AdminLayout"
import Dashboard from "@/page/dashboard/Dashboard"
import Residents from "@/page/residents/Residents"
import Payments from "@/page/payments/Payments"


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="residents" element={<Residents />} />
        <Route path="payments" element={<Payments />} />
      </Route>
    </Routes>
  )
}

export default App
