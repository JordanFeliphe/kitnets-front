import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/shared/components/ui/card"
import { Button } from "@/app/shared/components/ui/button"
import { Badge } from "@/app/shared/components/ui/badge"
import { StatusBadge } from "@/app/shared/components/ui/status-badge"
import { Input } from "@/app/shared/components/ui/input"
import { Label } from "@/app/shared/components/ui/label"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from '@/app/shared/components/ui/breadcrumb'
import { Alert, AlertDescription, AlertTitle } from '@/app/shared/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/shared/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select"
import {
  User,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Shield,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/app/shared/components/ui/use-toast"

const profileData = {
  personal: {
    name: "João da Silva",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    birthDate: "01/01/1990",
    maritalStatus: "Solteiro",
    profession: "Engenheiro de Software"
  },
  address: {
    street: "Rua das Flores, 123",
    unit: "Apt. 101",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    cep: "01234-567",
    complement: "Bloco A"
  },
  emergency: {
    name: "Maria Silva",
    relationship: "Mãe",
    phone: "(11) 98888-8888",
    email: "maria.silva@email.com"
  },
  account: {
    status: "Ativo",
    role: "Morador",
    contractNumber: "CT-2024-001",
    entryDate: "01/01/2024",
    contractEndDate: "31/12/2024"
  }
}

export default function ResidentProfile() {
  const { toast } = useToast()
  const [, setEditingSection] = useState<string | null>(null)
  const [formData, setFormData] = useState(profileData)

  const handleEdit = (section: string) => {
    setEditingSection(section)
  }

  const handleSave = (_section: string) => {
    // Here you would typically make an API call to save the data
    toast({
      title: "Dados atualizados",
      description: "Suas informações foram atualizadas com sucesso.",
    })
    setEditingSection(null)
  }

  const handleCancel = () => {
    // Reset form data to original
    setFormData(profileData)
    setEditingSection(null)
  }

  const handleInputChange = (section: keyof typeof formData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/resident">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Meus Dados</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Meus Dados</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie suas informações pessoais
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Informações Pessoais */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => handleEdit('personal')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Editar Informações Pessoais</DialogTitle>
                    <DialogDescription>
                      Atualize suas informações pessoais. Campos marcados com * são obrigatórios.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                    <div>
                      <Label htmlFor="edit-name">Nome Completo *</Label>
                      <Input
                        id="edit-name"
                        value={formData.personal.name}
                        onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">E-mail *</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={formData.personal.email}
                        onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Telefone *</Label>
                      <Input
                        id="edit-phone"
                        value={formData.personal.phone}
                        onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-birthdate">Data de Nascimento</Label>
                      <Input
                        id="edit-birthdate"
                        type="date"
                        value={formData.personal.birthDate}
                        onChange={(e) => handleInputChange('personal', 'birthDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-marital">Estado Civil</Label>
                      <Select
                        value={formData.personal.maritalStatus}
                        onValueChange={(value) => handleInputChange('personal', 'maritalStatus', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                          <SelectItem value="Casado">Casado(a)</SelectItem>
                          <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                          <SelectItem value="Viúvo">Viúvo(a)</SelectItem>
                          <SelectItem value="União Estável">União Estável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-profession">Profissão</Label>
                      <Input
                        id="edit-profession"
                        value={formData.personal.profession}
                        onChange={(e) => handleInputChange('personal', 'profession', e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={() => handleSave('personal')}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" value={formData.personal.name} readOnly />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" value={formData.personal.cpf} readOnly />
                <p className="text-xs text-muted-foreground mt-1">Documento não pode ser alterado</p>
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={formData.personal.email} readOnly />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={formData.personal.phone} readOnly />
              </div>
              <div>
                <Label htmlFor="birthdate">Data de Nascimento</Label>
                <Input id="birthdate" value={formData.personal.birthDate} readOnly />
              </div>
              <div>
                <Label htmlFor="rg">RG</Label>
                <Input id="rg" value={formData.personal.rg} readOnly />
                <p className="text-xs text-muted-foreground mt-1">Documento não pode ser alterado</p>
              </div>
              <div>
                <Label htmlFor="marital">Estado Civil</Label>
                <Input id="marital" value={formData.personal.maritalStatus} readOnly />
              </div>
              <div>
                <Label htmlFor="profession">Profissão</Label>
                <Input id="profession" value={formData.personal.profession} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status da Conta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Status da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Status:</span>
              <StatusBadge status={formData.account.status} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Tipo:</span>
              <Badge variant="secondary">
                {formData.account.role}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Unidade:</span>
              <span className="font-medium">{formData.address.unit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Contrato:</span>
              <span className="text-sm font-medium">{formData.account.contractNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Data de Entrada:</span>
              <span className="text-sm">{formData.account.entryDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Vencimento:</span>
              <span className="text-sm">{formData.account.contractEndDate}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço da Unidade
            </CardTitle>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Alterações requerem aprovação</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" value={formData.address.street} readOnly />
            </div>
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Input id="unit" value={formData.address.unit} readOnly />
            </div>
            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input id="complement" value={formData.address.complement} readOnly />
            </div>
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input id="neighborhood" value={formData.address.neighborhood} readOnly />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" value={formData.address.city} readOnly />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input id="state" value={formData.address.state} readOnly />
            </div>
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" value={formData.address.cep} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contato de Emergência */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contato de Emergência
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => handleEdit('emergency')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Contato de Emergência</DialogTitle>
                  <DialogDescription>
                    Atualize as informações do seu contato de emergência.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div>
                    <Label htmlFor="edit-emergency-name">Nome Completo *</Label>
                    <Input 
                      id="edit-emergency-name" 
                      value={formData.emergency.name}
                      onChange={(e) => handleInputChange('emergency', 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-emergency-relationship">Parentesco *</Label>
                    <Select 
                      value={formData.emergency.relationship}
                      onValueChange={(value) => handleInputChange('emergency', 'relationship', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pai">Pai</SelectItem>
                        <SelectItem value="Mãe">Mãe</SelectItem>
                        <SelectItem value="Irmão">Irmão/Irmã</SelectItem>
                        <SelectItem value="Cônjuge">Cônjuge</SelectItem>
                        <SelectItem value="Filho">Filho/Filha</SelectItem>
                        <SelectItem value="Amigo">Amigo(a)</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-emergency-phone">Telefone *</Label>
                    <Input 
                      id="edit-emergency-phone" 
                      value={formData.emergency.phone}
                      onChange={(e) => handleInputChange('emergency', 'phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-emergency-email">E-mail</Label>
                    <Input 
                      id="edit-emergency-email" 
                      type="email"
                      value={formData.emergency.email}
                      onChange={(e) => handleInputChange('emergency', 'email', e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={() => handleSave('emergency')}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency-name">Nome</Label>
              <Input id="emergency-name" value={formData.emergency.name} readOnly />
            </div>
            <div>
              <Label htmlFor="emergency-relationship">Parentesco</Label>
              <Input id="emergency-relationship" value={formData.emergency.relationship} readOnly />
            </div>
            <div>
              <Label htmlFor="emergency-phone">Telefone</Label>
              <Input id="emergency-phone" value={formData.emergency.phone} readOnly />
            </div>
            <div>
              <Label htmlFor="emergency-email">E-mail</Label>
              <Input id="emergency-email" value={formData.emergency.email} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Informações de Segurança</AlertTitle>
        <AlertDescription>
          Algumas informações como CPF e RG não podem ser alteradas por questões de segurança.
          Para alterações nestes dados, entre em contato com a administração.
        </AlertDescription>
      </Alert>
    </div>
  )
}