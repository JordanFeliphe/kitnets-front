import { ResidentsTable } from "@/components/tables/ResidentsTable";

const mockResidents = [
  { id: 1, name: "João da Silva", cpf: "123.456.789-00", email: "joao@email.com", phone: "(11) 91234-5678", unit: "101", status: "Ativo", entryDate: "10/01/2024", rentAmount: "800,00", pendingPayments: 0 },
  { id: 2, name: "Maria Santos", cpf: "987.654.321-00", email: "maria@email.com", phone: "(11) 99876-5432", unit: "103", status: "Ativo", entryDate: "15/03/2024", rentAmount: "900,00", pendingPayments: 1 },
  { id: 3, name: "Pedro Costa", cpf: "456.789.123-00", email: "pedro@email.com", phone: "(11) 95555-1234", unit: "201", status: "Ativo", entryDate: "22/02/2024", rentAmount: "1200,00", pendingPayments: 0 },
  { id: 4, name: "Ana Oliveira", cpf: "321.654.987-00", email: "ana@email.com", phone: "(11) 94444-5678", unit: "203", status: "Ativo", entryDate: "08/04/2024", rentAmount: "1300,00", pendingPayments: 0 },
  { id: 5, name: "Carlos Lima", cpf: "789.123.456-00", email: "carlos@email.com", phone: "(11) 93333-9876", unit: "204", status: "Ativo", entryDate: "12/05/2024", rentAmount: "850,00", pendingPayments: 2 },
  { id: 6, name: "Fernanda Rocha", cpf: "147.258.369-00", email: "fernanda@email.com", phone: "(11) 92222-4567", unit: "302", status: "Ativo", entryDate: "30/01/2024", rentAmount: "1400,00", pendingPayments: 0 },
  { id: 7, name: "Roberto Dias", cpf: "963.852.741-00", email: "roberto@email.com", phone: "(11) 91111-8765", unit: "303", status: "Inativo", entryDate: "18/06/2024", rentAmount: "900,00", pendingPayments: 3 },
  { id: 8, name: "Juliana Ferreira", cpf: "258.147.936-00", email: "juliana@email.com", phone: "(11) 98888-2345", unit: "304", status: "Pendente", entryDate: "02/07/2024", rentAmount: "850,00", pendingPayments: 1 }
];

export default function Residents() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Moradores</h1>
          <p className="text-muted-foreground">
            Gerencie todos os moradores do empreendimento
          </p>
        </div>
      </div>
      
      <ResidentsTable data={mockResidents} />
    </div>
  );
}
