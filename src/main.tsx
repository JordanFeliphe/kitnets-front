import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app/App.tsx"
import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "./contexts/Theme.tsx"
import { Toaster } from "sonner"
import "@fontsource-variable/inter"
import "@/global/globals.css"
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <App />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </Router>
  </React.StrictMode>
)
