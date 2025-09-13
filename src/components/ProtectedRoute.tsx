import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // If user is authenticated but shouldn't be on auth pages
  if (isAuthenticated && location.pathname === '/auth') {
    return <Navigate to="/admin" replace />
  }

  // If specific roles are required, check if user has permission
  if (allowedRoles.length > 0 && user) {
    const hasAccess = allowedRoles.includes(user.role)
    
    if (!hasAccess) {
      // Redirect based on user role
      const redirectPath = user.role === 'RESIDENT' ? '/resident' : '/admin'
      return <Navigate to={redirectPath} replace />
    }
  }

  return <>{children}</>
}