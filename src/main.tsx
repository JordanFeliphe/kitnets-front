import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app/App.tsx"
import { BrowserRouter as Router } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/app/shared/components/theme/ThemeProvider"
import { AuthProvider } from "@/app/shared/contexts/AuthContext"
import { ErrorBoundary } from "@/app/shared/components/ErrorBoundary"
import { Toaster } from "@/app/shared/components/ui/sonner"
import "@fontsource-variable/inter"
import "@/global/globals.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider>
            <AuthProvider>
              <App />
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
