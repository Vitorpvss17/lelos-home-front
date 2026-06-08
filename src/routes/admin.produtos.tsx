import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createProduct,
  deleteProduct,
  listCategories,
  listProducts,
  toggleProduct,
  updateProduct,
} from "@/lib/admin/api";
import { PRODUCT_TYPE_LABEL } from "@/lib/admin/types";
import type { AdminProduct, ProductReq, ProductType } from "@/lib/admin/types";
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

export const Route = createFileRoute("/admin/produtos")({ component: ProdutosPage });

interface FormState {
  name: string;
  description: string;
  type: ProductType;
  salePrice: string;
  rentPrice: string;
  stockQty: string;
  categoryId: string;
  imageUrls: string;
}

const EMPTY: FormState = {
  name: "",
  description: "",
  type: "BOTH",
  salePrice: "",
  rentPrice: "",
  stockQty: "0",
  categoryId: "",
  imageUrls: "",
};

function toForm(p: AdminProduct): FormState {
  return {
    name: p.name,
    description: p.description ?? "",
    type: p.type,
    salePrice: p.salePrice != null ? String(p.salePrice) : "",
    rentPrice: p.rentPrice != null ? String(p.rentPrice) : "",
    stockQty: String(p.stockQty ?? 0),
    categoryId: p.categoryId ?? "",
    imageUrls: (p.imageUrls ?? []).join("\n"),
  };
}

function toRequest(f: FormState): ProductReq {
  const num = (v: string) => (v.trim() === "" ? null : Number(v));
  return {
    name: f.name.trim(),
    description: f.description.trim() || null,
    type: f.type,
    salePrice: num(f.salePrice),
    rentPrice: num(f.rentPrice),
    stockQty: num(f.stockQty) ?? 0,
    categoryId: f.categoryId || null,
    imageUrls: f.imageUrls
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

function ProdutosPage() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => (await listProducts()).content,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listCategories,
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "products"] });

  const saveMut = useMutation({
    mutationFn: (vars: { id?: string; body: ProductReq }) =>
      vars.id ? updateProduct(vars.id, vars.body) : createProduct(vars.body),
    onSuccess: () => {
      invalidate();
      setOpen(false);
      toast.success(editing ? "Produto atualizado." : "Produto criado.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao salvar."),
  });
  const toggleMut = useMutation({
    mutationFn: toggleProduct,
    onSuccess: invalidate,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro."),
  });
  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      invalidate();
      toast.success("Produto excluído.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao excluir."),
  });

  const catName = useMemo(() => {
    const m = new Map(categories.map((c) => [c.id, c.name]));
    return (id: string | null) => (id ? (m.get(id) ?? "—") : "—");
  }, [categories]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };
  const openEdit = (p: AdminProduct) => {
    setEditing(p);
    setForm(toForm(p));
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Informe o nome.");
    saveMut.mutate({ id: editing?.id, body: toRequest(form) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-primary">Produtos</h1>
          <p className="text-sm text-muted-foreground">{products.length} cadastrados</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="size-4" /> Novo produto
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Venda</TableHead>
              <TableHead className="text-right">Aluguel</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead className="text-center">Ativo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  Nenhum produto. Clique em "Novo produto".
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-primary">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{catName(p.categoryId)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{PRODUCT_TYPE_LABEL[p.type]}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {p.salePrice != null ? fmtBRL(p.salePrice) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {p.rentPrice != null ? fmtBRL(p.rentPrice) : "—"}
                  </TableCell>
                  <TableCell className="text-right">{p.stockQty}</TableCell>
                  <TableCell className="text-center">
                    <Switch checked={p.active} onCheckedChange={() => toggleMut.mutate(p.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="size-4" />
                      </Button>
                      <ConfirmDelete
                        title="Excluir produto?"
                        description={`"${p.name}" será removido. Pedidos existentes mantêm o histórico.`}
                        onConfirm={() => deleteMut.mutate(p.id)}
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
            <DialogTitle>{editing ? "Editar produto" : "Novo produto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="desc">Descrição</Label>
              <Textarea
                id="desc"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
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
                <Label>Categoria</Label>
                <Select
                  value={form.categoryId || "none"}
                  onValueChange={(v) => setForm({ ...form, categoryId: v === "none" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sem categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem categoria</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="sale">Preço venda</Label>
                <Input
                  id="sale"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.salePrice}
                  onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="rent">Preço aluguel</Label>
                <Input
                  id="rent"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.rentPrice}
                  onChange={(e) => setForm({ ...form, rentPrice: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={form.stockQty}
                  onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="imgs">Imagens (uma URL por linha)</Label>
              <Textarea
                id="imgs"
                rows={2}
                placeholder="https://..."
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
