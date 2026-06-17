import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetManagement, useCreateManagementMember, useUpdateManagementMember, useDeleteManagementMember,
  getGetManagementQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/upload";
import { Plus, Pencil, Trash2, User } from "lucide-react";

type MgmtForm = { name: string; designation: string; photoUrl: string; order: string };
const empty: MgmtForm = { name: "", designation: "", photoUrl: "", order: "" };

export default function AdminManagement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: members, isLoading } = useGetManagement();
  const createMutation = useCreateManagementMember();
  const updateMutation = useUpdateManagementMember();
  const deleteMutation = useDeleteManagementMember();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<MgmtForm>(empty);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: getGetManagementQueryKey() });

  const openCreate = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (m: any) => {
    setEditId(m.id);
    setForm({ name: m.name || "", designation: m.designation || "", photoUrl: m.photoUrl || "", order: String(m.order ?? "") });
    setOpen(true);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm(f => ({ ...f, photoUrl: url }));
      toast({ title: "ફોટો અપલોડ થઈ ગયો" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    const data: any = {
      name: form.name,
      designation: form.designation,
      ...(form.photoUrl && { photoUrl: form.photoUrl }),
      ...(form.order && { order: parseInt(form.order) }),
    };
    if (editId) {
      updateMutation.mutate({ id: editId, data }, {
        onSuccess: () => { toast({ title: "સફળ! સભ્ય અપડેટ થઈ ગઈ." }); refresh(); setOpen(false); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      });
    } else {
      createMutation.mutate({ data }, {
        onSuccess: () => { toast({ title: "સફળ! નવી સભ્ય ઉમેરાઈ." }); refresh(); setOpen(false); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => { toast({ title: "સભ્ય ડિલીટ થઈ ગઈ." }); refresh(); setDeleteId(null); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">સંચાલક મંડળ</h1>
          <p className="text-gray-500 text-sm">Management Committee</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} /> નવા સભ્ય ઉમેરો
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : (members || []).length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <User size={48} className="mx-auto mb-4 opacity-30" />
          <p>કોઈ સભ્ય મળ્યા નહીં. ઉપરથી ઉમેરો.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(members || []).map((m: any) => (
            <Card key={m.id} className="border-primary/10 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-4 mb-3">
                  {m.photoUrl ? (
                    <img src={m.photoUrl} alt={m.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                  ) : (
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <User size={24} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate">{m.name}</div>
                    <div className="text-sm text-primary font-medium">{m.designation}</div>
                    {m.order != null && <div className="text-xs text-gray-400">ક્રમ: {m.order}</div>}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={() => openEdit(m)} className="gap-1">
                    <Pencil size={13} /> સંપાદિત
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(m.id)} className="gap-1">
                    <Trash2 size={13} /> ડિલીટ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "સભ્ય સંપાદિત કરો" : "નવા સભ્ય ઉમેરો"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>નામ *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="સભ્યનું નામ" />
            </div>
            <div>
              <Label>હોદ્દો (Designation) *</Label>
              <Input value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} placeholder="દા.ત. પ્રમુખ, મંત્રી..." />
            </div>
            <div>
              <Label>ક્રમ (Order)</Label>
              <Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} placeholder="1, 2, 3..." />
            </div>
            <div>
              <Label>ફોટો</Label>
              {form.photoUrl && (
                <img src={form.photoUrl} alt="preview" className="w-20 h-20 rounded-full object-cover mb-2 border" />
              )}
              <Input type="file" accept="image/*" onChange={handlePhoto} disabled={uploading} />
              {uploading && <p className="text-xs text-gray-400 mt-1">અપલોડ થઈ રહ્યો છે...</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>રદ કરો</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.designation || createMutation.isPending || updateMutation.isPending}>
              {editId ? "અપડેટ કરો" : "ઉમેરો"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ખાતરી કરો</DialogTitle>
          </DialogHeader>
          <p>શું તમે ખરેખર આ સભ્યને ડિલીટ કરવા માંગો છો?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>રદ કરો</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)} disabled={deleteMutation.isPending}>
              ડિલીટ કરો
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
