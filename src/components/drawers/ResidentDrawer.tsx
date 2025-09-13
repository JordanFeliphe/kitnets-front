import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, UserRole, UserStatus } from "@/types"
import { Users, Phone, Mail, CreditCard, Shield, Calendar } from "lucide-react"

const residentFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CPF inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  role: z.enum(["ADMIN", "MANAGER", "RESIDENT"]),
  status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]),
  preferences: z.object({
    theme: z.enum(["light", "dark", "system"]),
    language: z.enum(["pt-BR", "en-US"]),
    notifications: z.object({
      email: z.boolean(),
      push: z.boolean(),
      sms: z.boolean(),
    }),
  }),
})

type ResidentFormData = z.infer<typeof residentFormSchema>

interface ResidentDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | "view"
  resident?: User
  onSubmit: (data: ResidentFormData) => Promise<void>
}

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  RESIDENT: "Morador",
}

const statusLabels: Record<UserStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  BLOCKED: "Bloqueado",
}

const statusVariants: Record<UserStatus, "statusActive" | "statusDraft" | "dangerAlt"> = {
  ACTIVE: "statusActive",
  INACTIVE: "statusDraft",
  BLOCKED: "dangerAlt",
}

const roleVariants: Record<UserRole, "premium" | "infoAlt" | "statusActive"> = {
  ADMIN: "premium",
  MANAGER: "infoAlt",
  RESIDENT: "statusActive",
}

export function ResidentDrawer({ open, onOpenChange, mode, resident, onSubmit }: ResidentDrawerProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const isReadOnly = mode === "view"

  const form = useForm<ResidentFormData>({
    resolver: zodResolver(residentFormSchema),
    defaultValues: resident ? {
      name: resident.name,
      email: resident.email,
      cpf: resident.cpf,
      phone: resident.phone,
      role: resident.role,
      status: resident.status,
      preferences: resident.preferences,
    } : {
      name: "",
      email: "",
      cpf: "",
      phone: "",
      role: "RESIDENT" as UserRole,
      status: "ACTIVE" as UserStatus,
      preferences: {
        theme: "system" as const,
        language: "pt-BR" as const,
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
    },
  })

  const handleSubmit = async (data: ResidentFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving resident:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Novo Morador"
      case "edit":
        return `Editar ${resident?.name}`
      case "view":
        return `Detalhes de ${resident?.name}`
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "create":
        return "Cadastre um novo morador no sistema"
      case "edit":
        return "Atualize as informações do morador"
      case "view":
        return "Visualize todas as informações do morador"
    }
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4,5})(\d{4})/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {getTitle()}
            </DrawerTitle>
            <DrawerDescription>{getDescription()}</DrawerDescription>
          </DrawerHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-4">
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Informações Pessoais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Nome Completo*</Label>
                    <Input
                      id="name"
                      placeholder="Digite o nome completo"
                      disabled={isReadOnly}
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF*</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      disabled={isReadOnly}
                      {...form.register("cpf")}
                      onChange={(e) => {
                        const formatted = formatCPF(e.target.value)
                        form.setValue("cpf", formatted)
                      }}
                    />
                    {form.formState.errors.cpf && (
                      <p className="text-sm text-destructive">{form.formState.errors.cpf.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone*</Label>
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      disabled={isReadOnly}
                      {...form.register("phone")}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value)
                        form.setValue("phone", formatted)
                      }}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email*</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      disabled={isReadOnly}
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* System Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Informações do Sistema
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Função</Label>
                    <Select 
                      value={form.watch("role")} 
                      onValueChange={(value: UserRole) => form.setValue("role", value)}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              <Badge variant={roleVariants[value as UserRole]}>
                                {label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={form.watch("status")} 
                      onValueChange={(value: UserStatus) => form.setValue("status", value)}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              <Badge variant={statusVariants[value as UserStatus]}>
                                {label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {mode === "view" && resident && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label>Data de Cadastro</Label>
                      <div className="text-sm text-muted-foreground">
                        {new Date(resident.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div>
                      <Label>Último Login</Label>
                      <div className="text-sm text-muted-foreground">
                        {resident.lastLoginAt 
                          ? new Date(resident.lastLoginAt).toLocaleDateString("pt-BR")
                          : "Nunca logou"
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preferências</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme">Tema</Label>
                    <Select 
                      value={form.watch("preferences.theme")} 
                      onValueChange={(value: "light" | "dark" | "system") => 
                        form.setValue("preferences.theme", value)
                      }
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Select 
                      value={form.watch("preferences.language")} 
                      onValueChange={(value: "pt-BR" | "en-US") => 
                        form.setValue("preferences.language", value)
                      }
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (BR)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Notificações</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="notif-email"
                        checked={form.watch("preferences.notifications.email")}
                        onChange={(e) => 
                          form.setValue("preferences.notifications.email", e.target.checked)
                        }
                        disabled={isReadOnly}
                        className="rounded border-input"
                      />
                      <Label htmlFor="notif-email" className="text-sm">Email</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="notif-push"
                        checked={form.watch("preferences.notifications.push")}
                        onChange={(e) => 
                          form.setValue("preferences.notifications.push", e.target.checked)
                        }
                        disabled={isReadOnly}
                        className="rounded border-input"
                      />
                      <Label htmlFor="notif-push" className="text-sm">Push</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="notif-sms"
                        checked={form.watch("preferences.notifications.sms")}
                        onChange={(e) => 
                          form.setValue("preferences.notifications.sms", e.target.checked)
                        }
                        disabled={isReadOnly}
                        className="rounded border-input"
                      />
                      <Label htmlFor="notif-sms" className="text-sm">SMS</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DrawerFooter>
              <div className="flex gap-2">
                {!isReadOnly && (
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Salvando..." : mode === "create" ? "Criar Morador" : "Salvar Alterações"}
                  </Button>
                )}
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1">
                    {isReadOnly ? "Fechar" : "Cancelar"}
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}