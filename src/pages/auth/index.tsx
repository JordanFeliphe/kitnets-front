import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/app/shared/components/ui/button";
import { Input } from "@/app/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import { Eye, EyeOff, Loader2, Moon, Sun } from "lucide-react";
import loginImage from "@/assets/login-image.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/shared/components/ui/form";
import { useAuth } from "@/app/shared/contexts/AuthContext";
import { useTheme } from "@/app/shared/components/theme/ThemeProvider";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(4, "A senha deve ter pelo menos 4 caracteres"),
});

type LoginSchema = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = isAdmin ? "/dashboard" : "/resident/dashboard";
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const onSubmit = async (data: LoginSchema) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast.success("Login realizado com sucesso");

      // Force navigation after successful login
      setTimeout(() => {
        const user = JSON.parse(sessionStorage.getItem("user") || "null");
        if (user) {
          const redirectPath = user.type === "ADMIN" ? "/dashboard" : "/resident/dashboard";
          navigate(redirectPath, { replace: true });
        }
      }, 100);
    } catch (error: any) {
      // Use the message from backend or fallback
      const errorMessage = error.message || "Usuário ou senha inválidos";
      toast.error(errorMessage);
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="w-9 h-9 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-2xl border border-border/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-xl flex items-center justify-center">
              <img 
                src={loginImage} 
                alt="Residencial Rubim" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-card-foreground">
              Residencial Rubim
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Faça login para acessar o sistema
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading || authLoading}
                className="w-full h-11 font-medium disabled:opacity-50"
              >
                {(isLoading || authLoading) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              Esqueceu sua senha?
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
