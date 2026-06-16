import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetStudents, useCreateStudent, useUpdateStudent, useDeleteStudent,
  getGetStudentsQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Users, Search } from "lucide-react";

const CLASSES = ["9A", "9B", "10A", "10B", "11", "12"];

type StudentForm = {
  name: string; grNumber: string; class: string; gender: string;
  dateOfBirth: string; mobileNumber: string; address: string; uidNumber: string;
};
const empty: StudentForm = { name: "", grNumber: "", class: "", gender: "", dateOfBirth: "", mobileNumber: "", address: "", uidNumber: "" };

export default function AdminStudents() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: students, isLoading } = useGetStudents();
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<StudentForm>(empty);

  const filtered = (students || []).filter(s => {
    const matchClass = filterClass === "all" || s.class === filterClass;
    const matchSearch = search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || s.grNumber.includes(search);
    return matchClass && matchSearch;
  });

  const refresh = () => qc.invalidateQueries({ queryKey: getGetStudentsQueryKey() });

  const openCreate = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (s: any) => {
    setEditId(s.id);
    setForm({
      name: s.name || "", grNumber: s.grNumber || "", class: s.class || "", gender: s.gender || "",
      dateOfBirth: s.dateOfBirth || "", mobileNumber: s.mobileNumber || "", address: s.address || "", uidNumber: s.uidNumber || "",
    });
    setOpen(true);
  };

  const handleSave = () => {
    const data = { ...form, gender: form.gender || undefined, dateOfBirth: form.dateOfBirth || undefined, mobileNumber: form.mobileNumber || undefined, address: form.address || undefined, uidNumber: form.uidNumber || undefined };
    if (editId) {
      updateMutation.mutate({ id: editId, data }, {
        onSuccess: () => { toast({ title: "Updated" }); refresh(); setOpen(false); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      });
    } else {
      createMutation.mutate({ data }, {
        onSuccess: () => { toast({ title: "Created" }); refresh(); setOpen(false); },
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
        <h2 className="text-xl font-bold text-gray-900">વિદ્યાર્થીઓ ({filtered.length})</h2>
        <Button onClick={openCreate} className="gap-2"><Plus size={16} /> નવો વિદ્યાર્થી</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input placeholder="નામ / GR શોધો..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-36"><SelectValue placeholder="ધોરણ" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">બધા</SelectItem>
            {CLASSES.map(c => <SelectItem key={c} value={c}>ધો. {c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>કોઈ વિદ્યાર્થી નહીં</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">GR નં.</th>
                <th className="px-4 py-3 text-left font-semibold">નામ</th>
                <th className="px-4 py-3 text-left font-semibold">ધોરણ</th>
                <th className="px-4 py-3 text-left font-semibold">જાતિ</th>
                <th className="px-4 py-3 text-left font-semibold">મોબાઇલ</th>
                <th className="px-4 py-3 text-right font-semibold">ક્રિયાઓ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-gray-500">{s.grNumber}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                  <td className="px-4 py-3"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">{s.class}</span></td>
                  <td className="px-4 py-3 text-gray-500">{(s as any).gender === "M" ? "પુ" : (s as any).gender === "F" ? "સ્ત્રી" : "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{(s as any).mobileNumber || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil size={14} /></Button>
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(s.id)}><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? "વિદ્યાર્થી સંપાદિત" : "નવો વિદ્યાર્થી"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>નામ *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><Label>GR નં. *</Label><Input value={form.grNumber} onChange={e => setForm(f => ({ ...f, grNumber: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ધોરણ *</Label>
                <Select value={form.class} onValueChange={v => setForm(f => ({ ...f, class: v }))}>
                  <SelectTrigger><SelectValue placeholder="ધોરણ" /></SelectTrigger>
                  <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>જાતિ</Label>
                <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                  <SelectTrigger><SelectValue placeholder="જાતિ" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">પુરૂષ</SelectItem>
                    <SelectItem value="F">સ્ત્રી</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>જન્મ તારીખ</Label><Input type="date" value={form.dateOfBirth} onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} /></div>
              <div><Label>મોબાઇલ</Label><Input value={form.mobileNumber} onChange={e => setForm(f => ({ ...f, mobileNumber: e.target.value }))} /></div>
            </div>
            <div><Label>સરનામું</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
            <div><Label>UID નં.</Label><Input value={form.uidNumber} onChange={e => setForm(f => ({ ...f, uidNumber: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>રદ</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.grNumber || !form.class}>
              {createMutation.isPending || updateMutation.isPending ? "..." : "સાચવો"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
