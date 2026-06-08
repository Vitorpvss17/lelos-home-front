import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, MessageCircle } from "lucide-react";
import { listOrders, updateOrderStatus } from "@/lib/admin/api";
import { ORDER_STATUS_LABEL } from "@/lib/admin/types";
import type { AdminOrder, OrderStatus } from "@/lib/admin/types";
import { fmtBRL } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/pedidos")({ component: PedidosPage });

const STATUSES: OrderStatus[] = ["PENDING", "SENT_TO_WHATSAPP", "CANCELLED"];

const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("pt-BR");
};

function statusVariant(s: OrderStatus): "default" | "secondary" | "destructive" {
  if (s === "CANCELLED") return "destructive";
  if (s === "SENT_TO_WHATSAPP") return "default";
  return "secondary";
}

function PedidosPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [detail, setDetail] = useState<AdminOrder | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders", status, createdFrom, createdTo],
    queryFn: async () =>
      (
        await listOrders({
          status: status === "ALL" ? undefined : status,
          createdFrom: createdFrom || undefined,
          createdTo: createdTo || undefined,
        })
      ).content,
  });

  const statusMut = useMutation({
    mutationFn: (vars: { id: string; status: OrderStatus }) =>
      updateOrderStatus(vars.id, vars.status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Status atualizado.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao atualizar."),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-primary">Pedidos</h1>
        <p className="text-sm text-muted-foreground">{orders.length} no período/filtro</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="w-48">
          <Label className="text-xs">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus | "ALL")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {ORDER_STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">De (criação)</Label>
          <Input type="date" value={createdFrom} onChange={(e) => setCreatedFrom(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Até (criação)</Label>
          <Input type="date" value={createdTo} onChange={(e) => setCreatedTo(e.target.value)} />
        </div>
        {(createdFrom || createdTo || status !== "ALL") && (
          <Button
            variant="ghost"
            onClick={() => {
              setStatus("ALL");
              setCreatedFrom("");
              setCreatedTo("");
            }}
          >
            Limpar
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead className="text-center">Itens</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Criado</TableHead>
              <TableHead className="w-52">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Nenhum pedido.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <span className="font-medium text-primary">{o.customerName}</span>
                    {o.customerPhone ? (
                      <span className="block text-xs text-muted-foreground">{o.customerPhone}</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(o.eventDate)}</TableCell>
                  <TableCell className="text-center">{o.items.length}</TableCell>
                  <TableCell className="text-right">{fmtBRL(o.totalAmount)}</TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(o.createdAt)}</TableCell>
                  <TableCell>
                    <Select
                      value={o.status}
                      onValueChange={(v) => statusMut.mutate({ id: o.id, status: v as OrderStatus })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {ORDER_STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setDetail(o)}>
                        <Eye className="size-4" />
                      </Button>
                      {o.whatsappUrl ? (
                        <a href={o.whatsappUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="text-green-600">
                            <MessageCircle className="size-4" />
                          </Button>
                        </a>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detalhe */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>Pedido de {detail.customerName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-muted-foreground">
                  <span>Status: <Badge variant={statusVariant(detail.status)}>{ORDER_STATUS_LABEL[detail.status]}</Badge></span>
                  <span>Evento: {fmtDate(detail.eventDate)}</span>
                  <span>Criado: {fmtDate(detail.createdAt)}</span>
                  {detail.customerPhone ? <span>Tel: {detail.customerPhone}</span> : null}
                </div>
                <div className="rounded-lg border border-border">
                  {detail.items.map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center justify-between border-b border-border/60 px-3 py-2 last:border-0"
                    >
                      <div>
                        <span className="font-medium text-primary">
                          {i.quantity}x {i.productName ?? i.kitName ?? "Item"}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {i.itemMode === "RENT" ? "Aluguel" : "Venda"}
                        </span>
                      </div>
                      <span>{fmtBRL(i.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between font-medium text-primary">
                  <span>Total</span>
                  <span>{fmtBRL(detail.totalAmount)}</span>
                </div>
                {detail.notes ? (
                  <p className="rounded-lg bg-secondary p-3 text-muted-foreground">
                    <span className="font-medium text-foreground">Observações: </span>
                    {detail.notes}
                  </p>
                ) : null}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
