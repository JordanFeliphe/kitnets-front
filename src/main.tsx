import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app/App.tsx"
import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "./components/theme/ThemeProvider.tsx"
import { AuthProvider } from "./contexts/AuthContext.tsx"
import { DataProvider } from "./contexts/DataContext.tsx"
import { UIProvider } from "./contexts/UIContext.tsx"
import { NotificationProvider } from "./contexts/NotificationContext.tsx"
import { ToastProvider } from "./components/providers/ToastProvider.tsx"
import { ErrorBoundary } from "./components/ErrorBoundary.tsx"
import { Toaster } from "sonner"
import "@fontsource-variable/inter"
import "@/global/globals.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <UIProvider>
                <DataProvider>
                  <ToastProvider>
                    <App />
                    <Toaster richColors position="top-right" />
                  </ToastProvider>
                </DataProvider>
              </UIProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
)
