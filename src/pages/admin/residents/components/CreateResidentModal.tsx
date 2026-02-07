import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw, Building, Shield } from 'lucide-react';
import { Button } from '@/app/shared/components/ui/button';
import { Input } from '@/app/shared/components/ui/input';
import { Label } from '@/app/shared/components/ui/label';
import { Checkbox } from '@/app/shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/shared/components/ui/select';
import { useCreateResident, useUpdateResident, useAvailableUnits } from '../hooks/useResidents';
import { CreateResidentModalProps } from '../types/residents.types';
import {
  validateResidentForm,
  handleCPFInput,
  handlePhoneInput,
  cleanCPF,
  cleanPhone,
  maskCPF,
  maskPhone,
  generateRandomPassword,
  ResidentFormData,
} from '@/app/shared/utils/validations';

const CreateResidentModal: React.FC<CreateResidentModalProps> = ({
  isOpen,
  onClose,
  editingUser = null,
}) => {
  const isEditing = !!editingUser;
  const createMutation = useCreateResident();
  const updateMutation = useUpdateResident();
  const { data: unitsData, isLoading: unitsLoading } = useAvailableUnits({
    enabled: isOpen,
  });

  const [formData, setFormData] = useState<ResidentFormData>({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    password: '',
    status: 'ACTIVE',
    unitId: 'none',
    requirePasswordReset: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reset form when modal opens/closes or editingUser changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && editingUser) {
        setFormData({
          name: editingUser.name,
          cpf: maskCPF(editingUser.cpf || ''),
          email: editingUser.email,
          phone: maskPhone(editingUser.phone || ''),
          password: '',
          status: editingUser.status === 'BLOCKED' || editingUser.status === 'TRASH'
            ? 'INACTIVE'
            : editingUser.status,
          unitId: 'none',
          requirePasswordReset: editingUser.requirePasswordReset || false,
        });
      } else {
        setFormData({
          name: '',
          cpf: '',
          email: '',
          phone: '',
          password: '',
          status: 'ACTIVE',
          unitId: 'none',
          requirePasswordReset: false,
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, isEditing, editingUser]);

  const handleInputChange = (field: keyof ResidentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword(8);
    handleInputChange('password', newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateResidentForm(formData, isEditing);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        cpf: cleanCPF(formData.cpf),
        email: formData.email.trim().toLowerCase(),
        phone: cleanPhone(formData.phone),
        status: formData.status,
        type: 'RESIDENT' as const,
        requirePasswordReset: formData.requirePasswordReset,
        ...(formData.unitId && formData.unitId !== 'none' && { unitId: formData.unitId }),
        ...(formData.password && { password: formData.password }),
      };

      if (isEditing && editingUser) {
        await updateMutation.mutateAsync({
          id: editingUser._id,
          data: submitData,
        });
      } else {
        await createMutation.mutateAsync({
          ...submitData,
          password: formData.password!, // Required for creation
        });
      }

      onClose();
    } catch (error) {
      // Error is handled by the mutation hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  const units = unitsData?.data || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Morador' : 'Novo Morador'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Informações Pessoais
              </h3>

              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                  placeholder="Digite o nome completo"
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleCPFInput(e.target.value, (value) => handleInputChange('cpf', value))}
                  className={errors.cpf ? 'border-red-500' : ''}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {errors.cpf && (
                  <p className="text-xs text-red-600">{errors.cpf}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="morador@email.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handlePhoneInput(e.target.value, (value) => handleInputChange('phone', value))}
                  className={errors.phone ? 'border-red-500' : ''}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
                {errors.phone && (
                  <p className="text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              {(!isEditing || formData.password) && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Senha {!isEditing && '*'}
                    {isEditing && <span className="text-xs text-muted-foreground">(deixe vazio para manter atual)</span>}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pr-16 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="Digite a senha"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-gray-100 rounded"
                        onClick={handleGeneratePassword}
                        title="Gerar senha aleatória"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-gray-100 rounded"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600">{errors.password}</p>
                  )}
                  {!isEditing && (
                    <p className="text-xs text-muted-foreground">
                      Clique no botão de recarregar para gerar uma senha aleatória
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Unidade & Acesso */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Unidade & Acesso
              </h3>

              {isEditing && editingUser?.contract ? (
                // Read-only contract information when editing
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 border rounded-lg">
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Informações da Unidade
                    </h4>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unidade:</span>
                        <span className="font-medium">{editingUser.contract.unit?.code || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor do Aluguel:</span>
                        <span className="font-medium">R$ {(editingUser.contract.rentAmount || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Depósito:</span>
                        <span>R$ {(editingUser.contract.depositAmount || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vencimento:</span>
                        <span>Dia {editingUser.contract.dayOfMonthDue || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Início do Contrato:</span>
                        <span>{editingUser.contract.startDate ? new Date(editingUser.contract.startDate).toLocaleDateString('pt-BR') : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {editingUser.status === 'BLOCKED' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-sm text-red-800 mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Informações do Bloqueio
                      </h4>
                      <div className="space-y-2 text-sm text-red-700">
                        {editingUser.blockedAt && (
                          <div className="flex justify-between">
                            <span>Bloqueado em:</span>
                            <span>{new Date(editingUser.blockedAt).toLocaleString('pt-BR')}</span>
                          </div>
                        )}
                        {editingUser.blockedUntil && (
                          <div className="flex justify-between">
                            <span>Bloqueado até:</span>
                            <span>{new Date(editingUser.blockedUntil).toLocaleString('pt-BR')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-700">
                      <strong>Nota:</strong> As informações da unidade e contrato não podem ser alteradas aqui.
                      Para mudanças contratuais, use a seção de contratos do sistema.
                    </p>
                  </div>
                </div>
              ) : (
                // Unit selection for new users
                <div className="space-y-2">
                  <Label htmlFor="unit">Selecionar Unidade</Label>
                  <Select
                    value={formData.unitId}
                    onValueChange={(value) => handleInputChange('unitId', value)}
                    disabled={unitsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={unitsLoading ? "Carregando unidades..." : "Escolher unidade..."} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma unidade atribuída</SelectItem>
                      {units.map((unit) => (
                        <SelectItem key={unit._id} value={unit._id}>
                          <div className="flex flex-col">
                            <span className="font-medium">Unidade {unit.number}</span>
                            <div className="text-xs text-muted-foreground">
                              {unit.type} • {unit.bedrooms} quartos • {unit.bathrooms} banheiros
                              {unit.rentValue > 0 && ` • R$ ${unit.rentValue.toLocaleString()}/mês`}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.unitId && formData.unitId !== 'none' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>Importante:</strong> Ao associar este morador a uma unidade, um contrato será automaticamente criado.
                        Você poderá definir os detalhes do contrato após salvar o morador.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                    <SelectItem value="INACTIVE">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requirePasswordReset"
                    checked={formData.requirePasswordReset}
                    onCheckedChange={(checked) => handleInputChange('requirePasswordReset', checked)}
                  />
                  <Label htmlFor="requirePasswordReset" className="text-sm">
                    Exigir redefinição de senha no primeiro acesso
                  </Label>
                </div>
              </div>

              {isEditing && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Nota:</strong> Alterações nas permissões e configurações do usuário entrarão em vigor imediatamente.
                    O usuário pode precisar fazer login novamente para ver as alterações.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (isEditing ? 'Atualizando...' : 'Criando...')
                : (isEditing ? 'Atualizar Morador' : 'Criar Morador')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResidentModal;