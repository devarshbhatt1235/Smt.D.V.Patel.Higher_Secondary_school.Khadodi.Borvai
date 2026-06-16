import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetTopStudents, useCreateTopStudent, useUpdateTopStudent, useDeleteTopStudent,
  getGetTopStudentsQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Medal } from "lucide-react";

const CLASSES = ["9A", "9B", "10A", "10B", "11", "12"];

type TSForm = { name: string; fatherName: string; class: string; rank: string; percentage: string; year: string; };
const empty: TSForm = { name: "", fatherName: "", class: "", rank: "1", percentage: "", year: new Date().getFullYear().toString() };

export default function AdminTopStudents() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: topStudents, isLoading } = useGetTopStudents();
  const createMutation = useCreateTopStudent();
  const updateMutation = useUpdateTopStudent();
  const deleteMutation = useDeleteTopStudent();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<TSForm>(empty);
  const [filterClass, setFilterClass] = useState("all");

  const filtered = (topStudents || []).filter(s => filterClass === "all" || s.class === filterClass);
  const refresh = () => qc.invalidateQueries({ queryKey: getGetTopStudentsQueryKey() });

  const openCreate = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (s: any) => {
    setEditId(s.id);
    setForm({ name: s.name || "", fatherName: s.fatherName || "", class: s.class || "", rank: String(s.rank || 1), percentage: String(s.percentage || ""), year: s.year || "" });
    setOpen(true);
  };

  const handleSave = () => {
    const data = { name: form.name, fatherName: form.fatherName || undefined, class: form.class, rank: parseInt(form.rank), percentage: form.percentage ? parseFloat(form.percentage) : undefined, year: form.year };
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
    if (!confirm("ડિલીટ કરવું?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { toast({ title: "Deleted" }); refresh(); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  const years = [...new Set((topStudents || []).map(s => s.year))].sort().reverse();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">તેજસ્વી વિદ્યાર્થીઓ</h2>
        <Button onClick={openCreate} className="gap-2"><Plus size={16} /> ઉમેરો</Button>
      </div>

      <Select value={filterClass} onValueChange={setFilterClass}>
        <SelectTrigger className="w-44"><SelectValue placeholder="ધોરણ ફિલ્ટર" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">બધા ધોરણ</SelectItem>
          {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500"><Medal size={40} className="mx-auto mb-3 opacity-30" /><p>કોઈ ડેટા નહીં</p></div>
      ) : (
        <div className="space-y-6">
          {years.filter(y => filtered.some(s => s.year === y)).map(year => (
            <div key={year}>
              <h3 className="font-semibold text-primary mb-3">શૈ.વ. {year}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.filter(s => s.year === year).sort((a, b) => a.rank - b.rank).map(s => (
                  <Card key={s.id} className="border-primary/10">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">{s.rank}</div>
                          <div>
                            <div className="font-semibold text-gray-900 leading-tight">{s.name}</div>
                            {s.fatherName && <div className="text-xs text-gray-500">{s.fatherName}</div>}
                            <div className="text-xs text-primary">ધો. {s.class}</div>
                            {s.percentage != null && <div className="text-sm font-bold text-green-600">{s.percentage}%</div>}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil size={12} /></Button>
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(s.id)}><Trash2 size={12} /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editId ? "સંપાદિત" : "નવો"} તેજસ્વી વિદ્યાર્થી</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>નામ *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>પિતાનું નામ</Label><Input value={form.fatherName} onChange={e => setForm(f => ({ ...f, fatherName: e.target.value }))} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>ધોરણ *</Label>
                <Select value={form.class} onValueChange={v => setForm(f => ({ ...f, class: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>ક્રમ *</Label>
                <Input type="number" min={1} max={5} value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value }))} />
              </div>
              <div><Label>ટકા</Label><Input type="number" step="0.01" value={form.percentage} onChange={e => setForm(f => ({ ...f, percentage: e.target.value }))} /></div>
            </div>
            <div><Label>શૈ.વ. (Year) *</Label><Input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2024-25" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>રદ</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.class || !form.year}>
              {createMutation.isPending || updateMutation.isPending ? "..." : "સાચવો"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
