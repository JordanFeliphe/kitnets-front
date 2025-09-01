import { useState } from "react";
import { PaymentTable } from "@/components/tables/PaymentTable";
import { CreatePaymentModal } from "@/components/modals/payments/CreatePaymentModal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal/ConfirmDeleteModal";
import { PaymentHistoryDrawer } from "@/components/drawers/payment-history-drawer/PaymentHistoryDrawer";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Payment } from "@/interfaces/payments/payments";
import { Resident } from "@/interfaces/resident/resident";

// Mock de pagamentos
const mockPayments: Payment[] = [
  {
    id: "1",
    residentName: "João da Silva",
    amount: "900.00",
    paymentDate: "2024-01-15",
    paymentMethod: "Card",
    status: "Paid",
  },
  {
    id: "2",
    residentName: "Maria Oliveira",
    amount: "950.00",
    paymentDate: "2024-02-10",
    paymentMethod: "Cash",
    status: "Pending",
  },
];

const mockResidents: Resident[] = [
  { id: "1", name: "João da Silva" },
  { id: "2", name: "Maria Oliveira" },
];

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [deleting, setDeleting] = useState<Payment | null>(null);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null
  ); // Corrigido aqui
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleCreateOrUpdate = (data: Omit<Payment, "id">) => {
    if (editing) {
      setPayments((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...data } : p))
      );
    } else {
      const newPayment: Payment = { id: String(Date.now()), ...data };
      setPayments((prev) => [...prev, newPayment]);
    }
    setEditing(null);
    setOpenCreate(false);
  };

  const handleDelete = () => {
    if (deleting) {
      setPayments((prev) => prev.filter((p) => p.id !== deleting.id));
      setDeleting(null);
    }
  };

  // Corrigido o tipo de 'r' para 'Resident' e ativado a função 'setSelectedResident'
  const handleShowHistory = (payment: Payment) => {
    const resident = mockResidents.find(
      (r: Resident) => r.name === payment.residentName
    );
    setSelectedResident(resident || null); // Agora 'setSelectedResident' está sendo chamado corretamente
    setDrawerOpen(true); // Abrindo o drawer
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Pagamentos</h1>
        <Button onClick={() => setOpenCreate(true)}>Novo pagamento</Button>
      </div>
      <PaymentTable
        data={payments}
        onEdit={(p) => {
          setEditing(p);
          setOpenCreate(true);
        }}
        onDelete={(p) => setDeleting(p)}
        onShowHistory={handleShowHistory} // Passando a função de histórico para o componente PaymentTable
      />
      <Dialog
        open={openCreate}
        onOpenChange={(v) => {
          setOpenCreate(v);
          if (!v) setEditing(null);
        }}
      >
        <CreatePaymentModal
          onSubmit={handleCreateOrUpdate}
          initialData={editing ?? undefined}
        />
      </Dialog>
      <ConfirmDeleteModal
        open={!!deleting}
        name={deleting?.residentName}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
      <PaymentHistoryDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        resident={selectedResident} // Passando o morador para o Drawer
      />
    </div>
  );
}
