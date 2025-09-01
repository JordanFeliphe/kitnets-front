import { useState } from "react";
import { ResidentTable } from "@/components/tables/ResidentTable";
import { CreateResidentModal } from "@/components/modals/resident/CreateResidentModal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal/ConfirmDeleteModal";
import { PaymentHistoryDrawer } from "@/components/drawers/payment-history-drawer/PaymentHistoryDrawer";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Resident } from "@/interfaces/resident/resident";

const mockResidents: Resident[] = [
  {
    id: "1",
    name: "João da Silva",
    cpf: "123.456.789-00",
    phone: "(11) 91234-5678",
    email: "joao@email.com",
    unit: "101",
    entryDate: "2024-01-10",
    rentAmount: "900.00",
    status: "Active",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    cpf: "987.654.321-00",
    phone: "(11) 99876-5432",
    email: "maria@email.com",
    unit: "102",
    entryDate: "2023-11-05",
    rentAmount: "950.00",
    status: "Inactive",
  },
];

export default function Residents() {
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<Resident | null>(null);
  const [deleting, setDeleting] = useState<Resident | null>(null);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleCreateOrUpdate = (data: Omit<Resident, "id">) => {
    if (editing) {
      setResidents((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...data } : r))
      );
    } else {
      const newResident: Resident = {
        id: String(Date.now()),
        ...data,
      };
      setResidents((prev) => [...prev, newResident]);
    }
    setEditing(null);
    setOpenCreate(false);
  };

  const handleDelete = () => {
    if (deleting) {
      setResidents((prev) => prev.filter((r) => r.id !== deleting.id));
      setDeleting(null);
    }
  };

  const handleShowHistory = (resident: Resident) => {
    setSelectedResident(resident);
    setDrawerOpen(true);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Moradores</h1>
        <Button onClick={() => setOpenCreate(true)}>Novo morador</Button>
      </div>
      <ResidentTable
        data={residents}
        onEdit={(r) => {
          setEditing(r);
          setOpenCreate(true);
        }}
        onDelete={(r) => setDeleting(r)}
        onShowHistory={handleShowHistory}
      />
      <Dialog
        open={openCreate}
        onOpenChange={(v) => {
          setOpenCreate(v);
          if (!v) setEditing(null);
        }}
      >
        <CreateResidentModal
          onSubmit={handleCreateOrUpdate}
          initialData={editing ?? undefined}
        />
      </Dialog>
      <ConfirmDeleteModal
        open={!!deleting}
        name={deleting?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
      <PaymentHistoryDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        resident={selectedResident}
      />
    </div>
  );
}
