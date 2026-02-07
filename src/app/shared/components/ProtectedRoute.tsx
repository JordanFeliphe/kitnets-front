import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedUserTypes?: ('ADMIN' | 'RESIDENT')[]
  requireAuth?: boolean
}

export function ProtectedRoute({
  children,
  allowedUserTypes = [],
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

  // If authentication is not required (public routes like login)
  if (!requireAuth) {
    // If user is authenticated and on auth page, redirect to their dashboard
    if (isAuthenticated && (location.pathname === '/' || location.pathname === '/auth')) {
      const redirectPath = user?.type === 'ADMIN' ? '/admin' : '/resident'
      return <Navigate to={redirectPath} replace />
    }
    return <>{children}</>
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // If specific user types are required, check if user has permission
  if (allowedUserTypes.length > 0 && user) {
    const hasAccess = allowedUserTypes.includes(user.type)

    if (!hasAccess) {
      // Redirect to /auth for unauthorized access
      return <Navigate to="/auth" replace />
    }
  }

  return <>{children}</>
}