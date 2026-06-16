import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetStaff, useCreateStaff, useUpdateStaff, useDeleteStaff,
  getGetStaffQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/upload";
import { Plus, Pencil, Trash2, User, Search } from "lucide-react";

type StaffForm = {
  name: string;
  qualification: string;
  subjectsTaught: string;
  employeeNumber: string;
  joiningDate: string;
  photoUrl: string;
};

const empty: StaffForm = { name: "", qualification: "", subjectsTaught: "", employeeNumber: "", joiningDate: "", photoUrl: "" };

export default function AdminStaff() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: staff, isLoading } = useGetStaff();
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<StaffForm>(empty);
  const [uploading, setUploading] = useState(false);

  const filtered = (staff || []).filter(s =>
    search === "" || s.name.toLowerCase().includes(search.toLowerCase())
  );

  const refresh = () => qc.invalidateQueries({ queryKey: getGetStaffQueryKey() });

  const openCreate = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (s: typeof staff extends (infer T)[] | undefined ? T : never) => {
    if (!s) return;
    setEditId((s as any).id);
    setForm({
      name: (s as any).name || "",
      qualification: (s as any).qualification || "",
      subjectsTaught: ((s as any).subjectsTaught || []).join(", "),
      employeeNumber: (s as any).employeeNumber || "",
      joiningDate: (s as any).joiningDate || "",
      photoUrl: (s as any).photoUrl || "",
    });
    setOpen(true);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm(f => ({ ...f, photoUrl: url }));
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    const data = {
      name: form.name,
      qualification: form.qualification || undefined,
      subjectsTaught: form.subjectsTaught ? form.subjectsTaught.split(",").map(s => s.trim()).filter(Boolean) : [],
      employeeNumber: form.employeeNumber || undefined,
      joiningDate: form.joiningDate || undefined,
      photoUrl: form.photoUrl || undefined,
    };
    if (editId) {
      updateMutation.mutate({ id: editId, data }, {
        onSuccess: () => { toast({ title: "Staff updated" }); refresh(); setOpen(false); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      });
    } else {
      createMutation.mutate({ data }, {
        onSuccess: () => { toast({ title: "Staff created" }); refresh(); setOpen(false); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("ખરેખર ડિલીટ કરવું છે?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { toast({ title: "Deleted" }); refresh(); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">સ્ટાફ ડિરેક્ટરી</h2>
        <Button onClick={openCreate} className="gap-2"><Plus size={16} /> નવો સ્ટાફ</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <Input placeholder="નામ શોધો..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <User size={40} className="mx-auto mb-3 opacity-30" />
          <p>કોઈ સ્ટાફ સભ્ય નહીં</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(s => (
            <Card key={s.id} className="border-primary/10">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {(s as any).photoUrl ? (
                    <img src={(s as any).photoUrl} alt={s.name} className="w-full h-full object-cover rounded-full" />
                  ) : <User size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{s.name}</div>
                  {(s as any).qualification && <div className="text-sm text-gray-500">{(s as any).qualification}</div>}
                  {(s as any).subjectsTaught?.length > 0 && (
                    <div className="text-xs text-primary mt-0.5">{(s as any).subjectsTaught.join(", ")}</div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(s as any)}><Pencil size={14} /></Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(s.id)}><Trash2 size={14} /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "સ્ટાફ સંપાદિત કરો" : "નવો સ્ટાફ ઉમેરો"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>નામ *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="સ્ટાફ સભ્યનું નામ" />
            </div>
            <div>
              <Label>લાયકાત</Label>
              <Input value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} placeholder="B.Ed., M.A., etc." />
            </div>
            <div>
              <Label>વિષયો (comma separated)</Label>
              <Input value={form.subjectsTaught} onChange={e => setForm(f => ({ ...f, subjectsTaught: e.target.value }))} placeholder="ગુજરાતી, ગણિત, વિજ્ઞાન" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>કર્મચારી નં.</Label>
                <Input value={form.employeeNumber} onChange={e => setForm(f => ({ ...f, employeeNumber: e.target.value }))} placeholder="EMP001" />
              </div>
              <div>
                <Label>જોડાણ તારીખ</Label>
                <Input type="date" value={form.joiningDate} onChange={e => setForm(f => ({ ...f, joiningDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>ફોટો</Label>
              <Input type="file" accept="image/*" onChange={handlePhoto} disabled={uploading} />
              {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
              {form.photoUrl && <img src={form.photoUrl} alt="preview" className="mt-2 w-16 h-16 object-cover rounded-full border" />}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>રદ કરો</Button>
            <Button onClick={handleSave} disabled={!form.name || createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? "સાચવી રહ્યા..." : "સાચવો"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
