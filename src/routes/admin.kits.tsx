import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createKit,
  deleteKit,
  listKits,
  listProducts,
  toggleKit,
  updateKit,
} from "@/lib/admin/api";
import { PRODUCT_TYPE_LABEL } from "@/lib/admin/types";
import type { AdminKit, KitItemReq, KitReq, ProductType } from "@/lib/admin/types";
import { fmtBRL } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
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
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

export const Route = createFileRoute("/admin/kits")({ component: KitsPage });

interface FormState {
  name: string;
  description: string;
  type: ProductType;
  salePrice: string;
  rentPrice: string;
  imageUrls: string;
  items: KitItemReq[];
}
const EMPTY: FormState = {
  name: "",
  description: "",
  type: "RENT",
  salePrice: "",
  rentPrice: "",
  imageUrls: "",
  items: [],
};

function toRequest(f: FormState): KitReq {
  const num = (v: string) => (v.trim() === "" ? null : Number(v));
  return {
    name: f.name.trim(),
    description: f.description.trim() || null,
    type: f.type,
    salePrice: num(f.salePrice),
    rentPrice: num(f.rentPrice),
    imageUrls: f.imageUrls.split("\n").map((s) => s.trim()).filter(Boolean),
    items: f.items.filter((i) => i.productId && i.quantity > 0),
  };
}

function KitsPage() {
  const qc = useQueryClient();
  const { data: kits = [], isLoading } = useQuery({
    queryKey: ["admin", "kits"],
    queryFn: async () => (await listKits()).content,
  });
  const { data: products = [] } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => (await listProducts()).content,
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminKit | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "kits"] });
  const saveMut = useMutation({
    mutationFn: (vars: { id?: string; body: KitReq }) =>
      vars.id ? updateKit(vars.id, vars.body) : createKit(vars.body),
    onSuccess: () => {
      invalidate();
      setOpen(false);
      toast.success(editing ? "Kit atualizado." : "Kit criado.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao salvar."),
  });
  const toggleMut = useMutation({
    mutationFn: toggleKit,
    onSuccess: invalidate,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro."),
  });
  const deleteMut = useMutation({
    mutationFn: deleteKit,
    onSuccess: () => {
      invalidate();
      toast.success("Kit excluído.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao excluir."),
  });

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };
  const openEdit = (k: AdminKit) => {
    setEditing(k);
    setForm({
      name: k.name,
      description: k.description ?? "",
      type: k.type,
      salePrice: k.salePrice != null ? String(k.salePrice) : "",
      rentPrice: k.rentPrice != null ? String(k.rentPrice) : "",
      imageUrls: (k.imageUrls ?? []).join("\n"),
      items: k.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });
    setOpen(true);
  };

  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, { productId: "", quantity: 1 }] }));
  const setItem = (idx: number, patch: Partial<KitItemReq>) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  const removeItem = (idx: number) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Informe o nome.");
    const valid = form.items.filter((i) => i.productId && i.quantity > 0);
    if (valid.length === 0) return toast.error("Adicione ao menos um item com produto e quantidade.");
    saveMut.mutate({ id: editing?.id, body: toRequest(form) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-primary">Kits</h1>
          <p className="text-sm text-muted-foreground">{kits.length} cadastrados</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="size-4" /> Novo kit
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Venda</TableHead>
              <TableHead className="text-right">Aluguel</TableHead>
              <TableHead className="text-center">Itens</TableHead>
              <TableHead className="text-center">Ativo</TableHead>
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
            ) : kits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Nenhum kit.
                </TableCell>
              </TableRow>
            ) : (
              kits.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium text-primary">{k.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{PRODUCT_TYPE_LABEL[k.type]}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {k.salePrice != null ? fmtBRL(k.salePrice) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {k.rentPrice != null ? fmtBRL(k.rentPrice) : "—"}
                  </TableCell>
                  <TableCell className="text-center">{k.items.length}</TableCell>
                  <TableCell className="text-center">
                    <Switch checked={k.active} onCheckedChange={() => toggleMut.mutate(k.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(k)}>
                        <Pencil className="size-4" />
                      </Button>
                      <ConfirmDelete
                        title="Excluir kit?"
                        description={`"${k.name}" será removido.`}
                        onConfirm={() => deleteMut.mutate(k.id)}
                        trigger={
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar kit" : "Novo kit"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="kname">Nome *</Label>
              <Input
                id="kname"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="kdesc">Descrição</Label>
              <Textarea
                id="kdesc"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Tipo *</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v as ProductType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOTH">Aluguel e venda</SelectItem>
                    <SelectItem value="RENT">Aluguel</SelectItem>
                    <SelectItem value="SALE">Venda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ksale">Preço venda</Label>
                <Input
                  id="ksale"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.salePrice}
                  onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="krent">Preço aluguel</Label>
                <Input
                  id="krent"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.rentPrice}
                  onChange={(e) => setForm({ ...form, rentPrice: e.target.value })}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Itens do kit *</Label>
                <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addItem}>
                  <Plus className="size-3.5" /> Item
                </Button>
              </div>
              {form.items.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                  Nenhum item. Adicione produtos que compõem o kit.
                </p>
              ) : (
                <div className="space-y-2">
                  {form.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <Select
                          value={it.productId || undefined}
                          onValueChange={(v) => setItem(idx, { productId: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Produto" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        type="number"
                        min="1"
                        className="w-20"
                        value={it.quantity}
                        onChange={(e) => setItem(idx, { quantity: Number(e.target.value) })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeItem(idx)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="kimgs">Imagens (uma URL por linha)</Label>
              <Textarea
                id="kimgs"
                rows={2}
                value={form.imageUrls}
                onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saveMut.isPending}>
                {saveMut.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
