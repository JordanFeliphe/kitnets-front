export interface Resident {
  id: string
  name: string
  cpf: string
  phone: string
  email: string
  unit: string
  entryDate: string
  rentAmount: string
  status: "Active" | "Inactive"
  notes?: string
}