import { Unit, UnitFilter, ApiResponse, CreateUnitForm, UnitStatus } from '@/types';
import { normalizeUnitCode, isValidUnitCode } from '@/utils/businessRules';

class UnitService {
  private units: Unit[] = [
    {
      id: '1',
      code: '10A',
      description: 'Quitinete completa com banheiro',
      floor: 1,
      area: 25,
      bedrooms: 0,
      bathrooms: 1,
      hasKitchen: true,
      hasPatio: false,
      status: 'OCCUPIED',
      monthlyRent: 800,
      deposit: 800,
      utilities: { water: true, electricity: true, gas: false, internet: true },
      images: ['unit_10a_1.jpg', 'unit_10a_2.jpg'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
    {
      id: '2',
      code: '10B',
      description: 'Quitinete ampla com área externa',
      floor: 1,
      area: 30,
      bedrooms: 0,
      bathrooms: 1,
      hasKitchen: true,
      hasPatio: true,
      status: 'AVAILABLE',
      monthlyRent: 900,
      deposit: 900,
      utilities: { water: true, electricity: true, gas: false, internet: true },
      images: ['unit_10b_1.jpg'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
    {
      id: '3',
      code: '11A',
      description: 'Quitinete com varanda',
      floor: 1,
      area: 28,
      bedrooms: 0,
      bathrooms: 1,
      hasKitchen: true,
      hasPatio: true,
      status: 'MAINTENANCE',
      monthlyRent: 850,
      deposit: 850,
      utilities: { water: true, electricity: true, gas: false, internet: true },
      images: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
    {
      id: '4',
      code: '11B',
      description: 'Quitinete padrão',
      floor: 1,
      area: 25,
      bedrooms: 0,
      bathrooms: 1,
      hasKitchen: true,
      hasPatio: false,
      status: 'RESERVED',
      monthlyRent: 780,
      deposit: 780,
      utilities: { water: true, electricity: true, gas: false, internet: false },
      images: ['unit_11b_1.jpg', 'unit_11b_2.jpg', 'unit_11b_3.jpg'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
    {
      id: '5',
      code: '20A',
      description: 'Quitinete no segundo andar com vista',
      floor: 2,
      area: 32,
      bedrooms: 0,
      bathrooms: 1,
      hasKitchen: true,
      hasPatio: false,
      status: 'AVAILABLE',
      monthlyRent: 950,
      deposit: 950,
      utilities: { water: true, electricity: true, gas: true, internet: true },
      images: ['unit_20a_1.jpg'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
    {
      id: '6',
      code: '20B',
      description: 'Quitinete premium com todas as comodidades',
      floor: 2,
      area: 35,
      bedrooms: 1,
      bathrooms: 1,
      hasKitchen: true,
      hasPatio: true,
      status: 'OCCUPIED',
      monthlyRent: 1100,
      deposit: 1100,
      utilities: { water: true, electricity: true, gas: true, internet: true },
      images: ['unit_20b_1.jpg', 'unit_20b_2.jpg'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
  ];

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getUnits(filter: UnitFilter = {}): Promise<ApiResponse<Unit[]>> {
    await this.delay(500);

    let filteredUnits = [...this.units];

    // Apply filters
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredUnits = filteredUnits.filter(unit =>
        unit.code.toLowerCase().includes(searchTerm) ||
        (unit.description && unit.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filter.status) {
      filteredUnits = filteredUnits.filter(unit => unit.status === filter.status);
    }

    if (filter.floor !== undefined) {
      filteredUnits = filteredUnits.filter(unit => unit.floor === filter.floor);
    }

    if (filter.bedrooms !== undefined) {
      filteredUnits = filteredUnits.filter(unit => unit.bedrooms === filter.bedrooms);
    }

    if (filter.minRent !== undefined) {
      filteredUnits = filteredUnits.filter(unit => unit.monthlyRent >= filter.minRent!);
    }

    if (filter.maxRent !== undefined) {
      filteredUnits = filteredUnits.filter(unit => unit.monthlyRent <= filter.maxRent!);
    }

    // Apply sorting
    if (filter.sortBy) {
      filteredUnits.sort((a, b) => {
        let aValue: any = a[filter.sortBy as keyof Unit];
        let bValue: any = b[filter.sortBy as keyof Unit];

        // Handle numeric sorting
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return filter.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        }

        // Handle string sorting
        aValue = String(aValue);
        bValue = String(bValue);
        
        if (filter.sortOrder === 'desc') {
          return bValue.localeCompare(aValue);
        }
        return aValue.localeCompare(bValue);
      });
    }

    // Apply pagination
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUnits = filteredUnits.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedUnits,
      message: 'Units retrieved successfully',
      meta: {
        total: filteredUnits.length,
        page,
        limit,
        totalPages: Math.ceil(filteredUnits.length / limit),
      },
    };
  }

  async getUnitById(id: string): Promise<ApiResponse<Unit>> {
    await this.delay(300);

    const unit = this.units.find(u => u.id === id);
    
    if (!unit) {
      return {
        success: false,
        data: null,
        message: 'Unit not found',
        errors: ['Unit with provided ID does not exist'],
      };
    }

    return {
      success: true,
      data: unit,
      message: 'Unit retrieved successfully',
    };
  }

  async getUnitByCode(code: string): Promise<ApiResponse<Unit>> {
    await this.delay(300);

    try {
      const normalizedCode = normalizeUnitCode(code);
      const unit = this.units.find(u => u.code === normalizedCode);
      
      if (!unit) {
        return {
          success: false,
          data: null,
          message: 'Unit not found',
          errors: ['Unit with provided code does not exist'],
        };
      }

      return {
        success: true,
        data: unit,
        message: 'Unit retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Invalid unit code',
        errors: [(error as Error).message],
      };
    }
  }

  async createUnit(unitData: CreateUnitForm): Promise<ApiResponse<Unit>> {
    await this.delay(800);

    // Validate data
    const errors: string[] = [];

    try {
      const normalizedCode = normalizeUnitCode(unitData.code);
      
      if (this.units.some(u => u.code === normalizedCode)) {
        errors.push('Código da unidade já existe');
      }

      unitData.code = normalizedCode;
    } catch (error) {
      errors.push((error as Error).message);
    }

    if (unitData.floor < 1) {
      errors.push('Andar deve ser maior que 0');
    }

    if (unitData.area <= 0) {
      errors.push('Área deve ser maior que 0');
    }

    if (unitData.bedrooms < 0) {
      errors.push('Número de quartos não pode ser negativo');
    }

    if (unitData.bathrooms < 1) {
      errors.push('Deve haver pelo menos 1 banheiro');
    }

    if (unitData.monthlyRent <= 0) {
      errors.push('Valor do aluguel deve ser maior que 0');
    }

    if (unitData.deposit < 0) {
      errors.push('Valor do depósito não pode ser negativo');
    }

    if (errors.length > 0) {
      return {
        success: false,
        data: null,
        message: 'Validation failed',
        errors,
      };
    }

    const newUnit: Unit = {
      id: Math.random().toString(36).substr(2, 9),
      ...unitData,
      status: 'AVAILABLE',
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.units.push(newUnit);

    return {
      success: true,
      data: newUnit,
      message: 'Unit created successfully',
    };
  }

  async updateUnit(id: string, unitData: Partial<Unit>): Promise<ApiResponse<Unit>> {
    await this.delay(500);

    const unitIndex = this.units.findIndex(u => u.id === id);
    
    if (unitIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'Unit not found',
        errors: ['Unit with provided ID does not exist'],
      };
    }

    // Validate data
    const errors: string[] = [];

    if (unitData.code) {
      try {
        const normalizedCode = normalizeUnitCode(unitData.code);
        
        if (this.units.some(u => u.code === normalizedCode && u.id !== id)) {
          errors.push('Código da unidade já existe');
        }

        unitData.code = normalizedCode;
      } catch (error) {
        errors.push((error as Error).message);
      }
    }

    if (unitData.floor !== undefined && unitData.floor < 1) {
      errors.push('Andar deve ser maior que 0');
    }

    if (unitData.area !== undefined && unitData.area <= 0) {
      errors.push('Área deve ser maior que 0');
    }

    if (unitData.bedrooms !== undefined && unitData.bedrooms < 0) {
      errors.push('Número de quartos não pode ser negativo');
    }

    if (unitData.bathrooms !== undefined && unitData.bathrooms < 1) {
      errors.push('Deve haver pelo menos 1 banheiro');
    }

    if (unitData.monthlyRent !== undefined && unitData.monthlyRent <= 0) {
      errors.push('Valor do aluguel deve ser maior que 0');
    }

    if (unitData.deposit !== undefined && unitData.deposit < 0) {
      errors.push('Valor do depósito não pode ser negativo');
    }

    if (errors.length > 0) {
      return {
        success: false,
        data: null,
        message: 'Validation failed',
        errors,
      };
    }

    const updatedUnit = {
      ...this.units[unitIndex],
      ...unitData,
      updatedAt: new Date(),
    };

    this.units[unitIndex] = updatedUnit;

    return {
      success: true,
      data: updatedUnit,
      message: 'Unit updated successfully',
    };
  }

  async deleteUnit(id: string): Promise<ApiResponse<null>> {
    await this.delay(400);

    const unitIndex = this.units.findIndex(u => u.id === id);
    
    if (unitIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'Unit not found',
        errors: ['Unit with provided ID does not exist'],
      };
    }

    // Business rule: cannot delete occupied units
    const unit = this.units[unitIndex];
    if (unit.status === 'OCCUPIED') {
      return {
        success: false,
        data: null,
        message: 'Cannot delete occupied unit',
        errors: ['Unidade ocupada não pode ser excluída'],
      };
    }

    this.units.splice(unitIndex, 1);

    return {
      success: true,
      data: null,
      message: 'Unit deleted successfully',
    };
  }

  async bulkUpdateStatus(unitIds: string[], status: UnitStatus): Promise<ApiResponse<Unit[]>> {
    await this.delay(600);

    const updatedUnits: Unit[] = [];
    const errors: string[] = [];

    for (const id of unitIds) {
      const unitIndex = this.units.findIndex(u => u.id === id);
      
      if (unitIndex === -1) {
        errors.push(`Unit with ID ${id} not found`);
        continue;
      }

      const unit = this.units[unitIndex];

      // Business rules for status changes
      if (unit.status === 'OCCUPIED' && status !== 'OCCUPIED') {
        errors.push(`Cannot change status of occupied unit ${unit.code}`);
        continue;
      }

      this.units[unitIndex] = {
        ...unit,
        status,
        updatedAt: new Date(),
      };
      
      updatedUnits.push(this.units[unitIndex]);
    }

    return {
      success: errors.length === 0,
      data: updatedUnits,
      message: `${updatedUnits.length} units updated successfully`,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async getAvailableUnits(): Promise<ApiResponse<Unit[]>> {
    await this.delay(300);

    const availableUnits = this.units.filter(unit => unit.status === 'AVAILABLE');

    return {
      success: true,
      data: availableUnits,
      message: 'Available units retrieved successfully',
    };
  }

  async searchUnits(query: string): Promise<ApiResponse<Unit[]>> {
    await this.delay(400);

    const searchTerm = query.toLowerCase();
    const filteredUnits = this.units.filter(unit =>
      unit.code.toLowerCase().includes(searchTerm) ||
      (unit.description && unit.description.toLowerCase().includes(searchTerm))
    );

    return {
      success: true,
      data: filteredUnits,
      message: 'Search completed successfully',
    };
  }

  async getUnitsByFloor(floor: number): Promise<ApiResponse<Unit[]>> {
    await this.delay(300);

    const units = this.units.filter(unit => unit.floor === floor);

    return {
      success: true,
      data: units,
      message: 'Units retrieved successfully',
    };
  }

  // Statistics methods
  async getUnitStats(): Promise<ApiResponse<{
    total: number;
    byStatus: Record<UnitStatus, number>;
    byFloor: Record<number, number>;
    occupancyRate: number;
    averageRent: number;
    totalMonthlyRevenue: number;
  }>> {
    await this.delay(300);

    const total = this.units.length;
    const occupied = this.units.filter(u => u.status === 'OCCUPIED').length;
    
    const byStatus = {
      AVAILABLE: this.units.filter(u => u.status === 'AVAILABLE').length,
      OCCUPIED: occupied,
      MAINTENANCE: this.units.filter(u => u.status === 'MAINTENANCE').length,
      RESERVED: this.units.filter(u => u.status === 'RESERVED').length,
    };

    const floors = [...new Set(this.units.map(u => u.floor))];
    const byFloor = floors.reduce((acc, floor) => {
      acc[floor] = this.units.filter(u => u.floor === floor).length;
      return acc;
    }, {} as Record<number, number>);

    const occupancyRate = total > 0 ? (occupied / total) * 100 : 0;
    const averageRent = this.units.reduce((sum, unit) => sum + unit.monthlyRent, 0) / total;
    const totalMonthlyRevenue = this.units
      .filter(u => u.status === 'OCCUPIED')
      .reduce((sum, unit) => sum + unit.monthlyRent, 0);

    const stats = {
      total,
      byStatus,
      byFloor,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      averageRent: Math.round(averageRent * 100) / 100,
      totalMonthlyRevenue,
    };

    return {
      success: true,
      data: stats,
      message: 'Unit statistics retrieved successfully',
    };
  }

  async addUnitImage(unitId: string, imageUrl: string): Promise<ApiResponse<Unit>> {
    await this.delay(300);

    const unitIndex = this.units.findIndex(u => u.id === unitId);
    
    if (unitIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'Unit not found',
        errors: ['Unit with provided ID does not exist'],
      };
    }

    this.units[unitIndex].images.push(imageUrl);
    this.units[unitIndex].updatedAt = new Date();

    return {
      success: true,
      data: this.units[unitIndex],
      message: 'Image added successfully',
    };
  }

  async removeUnitImage(unitId: string, imageUrl: string): Promise<ApiResponse<Unit>> {
    await this.delay(300);

    const unitIndex = this.units.findIndex(u => u.id === unitId);
    
    if (unitIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'Unit not found',
        errors: ['Unit with provided ID does not exist'],
      };
    }

    const imageIndex = this.units[unitIndex].images.indexOf(imageUrl);
    if (imageIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'Image not found',
        errors: ['Image not found in unit'],
      };
    }

    this.units[unitIndex].images.splice(imageIndex, 1);
    this.units[unitIndex].updatedAt = new Date();

    return {
      success: true,
      data: this.units[unitIndex],
      message: 'Image removed successfully',
    };
  }
}

export const unitService = new UnitService();