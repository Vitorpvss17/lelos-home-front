import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  listCategories,
  toggleCategory,
  updateCategory,
} from "@/lib/admin/api";
import type { AdminCategory, CategoryReq } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

export const Route = createFileRoute("/admin/categorias")({ component: CategoriasPage });

interface FormState {
  name: string;
  description: string;
  imageUrl: string;
}
const EMPTY: FormState = { name: "", description: "", imageUrl: "" };

function CategoriasPage() {
  const qc = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listCategories,
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "categories"] });

  const saveMut = useMutation({
    mutationFn: (vars: { id?: string; body: CategoryReq }) =>
      vars.id ? updateCategory(vars.id, vars.body) : createCategory(vars.body),
    onSuccess: () => {
      invalidate();
      setOpen(false);
      toast.success(editing ? "Categoria atualizada." : "Categoria criada.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao salvar."),
  });
  const toggleMut = useMutation({
    mutationFn: toggleCategory,
    onSuccess: invalidate,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro."),
  });
  const deleteMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      invalidate();
      toast.success("Categoria excluída.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao excluir."),
  });

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };
  const openEdit = (c: AdminCategory) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description ?? "", imageUrl: c.imageUrl ?? "" });
    setOpen(true);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Informe o nome.");
    saveMut.mutate({
      id: editing?.id,
      body: {
        name: form.name.trim(),
        description: form.description.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-primary">Categorias</h1>
          <p className="text-sm text-muted-foreground">{categories.length} cadastradas</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="size-4" /> Nova categoria
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-center">Ativa</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  Nenhuma categoria.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-primary">{c.name}</TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {c.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={c.active} onCheckedChange={() => toggleMut.mutate(c.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                        <Pencil className="size-4" />
                      </Button>
                      <ConfirmDelete
                        title="Excluir categoria?"
                        description={`"${c.name}" será removida. Produtos vinculados ficam sem categoria.`}
                        onConfirm={() => deleteMut.mutate(c.id)}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="cname">Nome *</Label>
              <Input
                id="cname"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cdesc">Descrição</Label>
              <Textarea
                id="cdesc"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cimg">URL da imagem</Label>
              <Input
                id="cimg"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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
