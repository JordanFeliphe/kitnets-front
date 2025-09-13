import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { Home } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/theme/ModeToggle"
import LoginImage from '@/assets/login-image.svg'
const authSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type AuthFormData = z.infer<typeof authSchema>

export default function Auth() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  })

  const fillDemoAccount = (email: string, password: string) => {
    setValue("email", email)
    setValue("password", password)
    setError("")
  }

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true)
    setError("")
    
    try {
      await login(data.email, data.password)
      
      toast.success("Login realizado com sucesso!")
      
      // Get user from localStorage to determine redirect
      const savedUser = localStorage.getItem('auth_user')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        if (user.role === 'RESIDENT') {
          navigate("/resident")
        } else {
          navigate("/admin")
        }
      } else {
        navigate("/admin") // fallback
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column - Image */}
      <div className="hidden lg:flex relative bg-background flex-col items-center justify-center p-6">
        {/* Brand */}
        <div className="absolute top-6 left-6 flex flex-col gap-1 text-foreground">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span className="text-xl font-semibold">Residencial Rubim</span>
          </div>
          <p className="text-sm text-muted-foreground ml-8">Sistema de Gestão</p>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <img
            src={LoginImage}
            alt="Residência"
            className="w-full h-auto max-w-md object-contain"
          />
          
          {/* Footer Text Below Image */}
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">
              © 2024 Residencial Rubim. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Desenvolvido por <span className="font-medium text-foreground">Jordan Feliphe Rubim</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="flex flex-col">
        {/* Top Navigation */}
        <div className="flex justify-end items-center gap-2 p-6">
          <a href="#" className="text-sm font-medium hover:underline">
            Login
          </a>
          <ModeToggle />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-[420px]">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Acessar sistema
              </CardTitle>
              <CardDescription>
                Informe seu e-mail e senha para fazer login
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@residencialrubim.com"
                    className="h-10"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    className="h-10"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-10"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="text-center">
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  Esqueceu sua senha?
                </a>
              </div>

              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-center">Contas Demo Disponíveis</h3>
                <div className="space-y-2 text-xs">
                  <button 
                    type="button"
                    onClick={() => fillDemoAccount("admin@residencialrubim.com", "123456")}
                    className="w-full p-2 bg-muted/50 rounded border hover:bg-muted transition-colors text-left"
                  >
                    <div className="font-medium">👑 Administrador</div>
                    <div className="text-muted-foreground">admin@residencialrubim.com</div>
                    <div className="text-muted-foreground">Senha: 123456</div>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => fillDemoAccount("manager@residencialrubim.com", "123456")}
                    className="w-full p-2 bg-muted/50 rounded border hover:bg-muted transition-colors text-left"
                  >
                    <div className="font-medium">👔 Gestor</div>
                    <div className="text-muted-foreground">manager@residencialrubim.com</div>
                    <div className="text-muted-foreground">Senha: 123456</div>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => fillDemoAccount("resident@residencialrubim.com", "123456")}
                    className="w-full p-2 bg-muted/50 rounded border hover:bg-muted transition-colors text-left"
                  >
                    <div className="font-medium">🏠 Morador</div>
                    <div className="text-muted-foreground">resident@residencialrubim.com</div>
                    <div className="text-muted-foreground">Senha: 123456</div>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Clique em qualquer conta para usar as credenciais automaticamente
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-center text-muted-foreground">
                Ao continuar, você concorda com nossos{" "}
                <a
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Termos de Serviço
                </a>{" "}
                e{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Política de Privacidade
                </a>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}