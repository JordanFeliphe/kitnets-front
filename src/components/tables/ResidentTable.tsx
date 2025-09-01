import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Resident } from "@/interfaces/resident/resident";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2, Clock } from "lucide-react";

interface Props {
  data: Resident[];
  onEdit?: (resident: Resident) => void;
  onDelete?: (resident: Resident) => void;
  onShowHistory?: (resident: Resident) => void;
}

export function ResidentTable({
  data,
  onEdit,
  onDelete,
  onShowHistory,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className="grid gap-4">
        {data.map((resident) => (
          <Card
            key={resident.id}
            className="border border-solid border-border rounded-md"
          >
            <CardContent className="p-4 space-y-2 text-sm">
              <div>
                <strong>Nome:</strong> {resident.name}
              </div>
              <div>
                <strong>CPF:</strong> {resident.cpf}
              </div>
              <div>
                <strong>Telefone:</strong> {resident.phone}
              </div>
              <div>
                <strong>Email:</strong> {resident.email}
              </div>
              <div>
                <strong>Unidade:</strong> {resident.unit}
              </div>
              <div>
                <strong>Data de Entrada:</strong> {resident.entryDate}
              </div>
              <div>
                <strong>Aluguel:</strong> {resident.rentAmount}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <Badge
                  className={
                    resident.status === "Active"
                      ? "bg-green-700 text-white"
                      : "bg-red-700 text-white"
                  }
                >
                  {resident.status === "Active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <div className="pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Ações
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(resident)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(resident)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                      Excluir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShowHistory?.(resident)}>
                      <Clock className="w-4 h-4 mr-2" />
                      Histórico
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-solid border-border overflow-hidden">
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="border-b border-solid border-border">
            <TableHead className="border-r border-solid border-border">
              Nome
            </TableHead>
            <TableHead className="border-r border-solid border-border">
              CPF
            </TableHead>
            <TableHead className="border-r border-solid border-border">
              Telefone
            </TableHead>
            <TableHead className="border-r border-solid border-border">
              Email
            </TableHead>
            <TableHead className="border-r border-solid border-border">
              Unidade
            </TableHead>
            <TableHead className="border-r border-solid border-border">
              Entrada
            </TableHead>
            <TableHead className="border-r border-solid border-border">
              Aluguel
            </TableHead>
            <TableHead className="border-r border-solid border-border">
              Status
            </TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((resident) => (
            <TableRow
              key={resident.id}
              className="border-b border-solid border-border"
            >
              <TableCell className="border-r border-solid border-border">
                {resident.name}
              </TableCell>
              <TableCell className="border-r border-solid border-border">
                {resident.cpf}
              </TableCell>
              <TableCell className="border-r border-solid border-border">
                {resident.phone}
              </TableCell>
              <TableCell className="border-r border-solid border-border">
                {resident.email}
              </TableCell>
              <TableCell className="border-r border-solid border-border">
                {resident.unit}
              </TableCell>
              <TableCell className="border-r border-solid border-border">
                {resident.entryDate}
              </TableCell>
              <TableCell className="border-r border-solid border-border">
                {resident.rentAmount}
              </TableCell>
              <TableCell className="border-r border-solid border-border">
                <Badge
                  className={
                    resident.status === "Active"
                      ? "bg-green-700 text-white"
                      : "bg-red-700 text-white"
                  }
                >
                  {resident.status === "Active" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(resident)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(resident)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                      Excluir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShowHistory?.(resident)}>
                      <Clock className="w-4 h-4 mr-2" />
                      Histórico
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
