import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetNotices, useCreateNotice, useUpdateNotice, useDeleteNotice,
  getGetNoticesQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Bell, Calendar } from "lucide-react";

type NoticeForm = { title: string; content: string; published: boolean; };
const empty: NoticeForm = { title: "", content: "", published: true };

export default function AdminNotices() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: notices, isLoading } = useGetNotices();
  const createMutation = useCreateNotice();
  const updateMutation = useUpdateNotice();
  const deleteMutation = useDeleteNotice();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<NoticeForm>(empty);

  const sorted = [...(notices || [])].sort(
    (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
  );
  const refresh = () => qc.invalidateQueries({ queryKey: getGetNoticesQueryKey() });

  const openCreate = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (n: any) => {
    setEditId(n.id);
    setForm({ title: n.title || "", content: n.content || "", published: !!n.published });
    setOpen(true);
  };

  const handleSave = () => {
    if (editId) {
      updateMutation.mutate({ id: editId, data: form }, {
        onSuccess: () => { toast({ title: "Updated" }); refresh(); setOpen(false); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      });
    } else {
      createMutation.mutate({ data: form }, {
        onSuccess: () => { toast({ title: "Created" }); refresh(); setOpen(false); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      });
    }
  };

  const handleToggle = (n: any) => {
    updateMutation.mutate({ id: n.id, data: { ...n, published: !n.published } }, {
      onSuccess: () => refresh(),
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("ડિલીટ કરવું?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { toast({ title: "Deleted" }); refresh(); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">સૂચનાઓ ({(notices || []).length})</h2>
        <Button onClick={openCreate} className="gap-2"><Plus size={16} /> નવી સૂચના</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-500"><Bell size={40} className="mx-auto mb-3 opacity-30" /><p>કોઈ સૂચના નહીં</p></div>
      ) : (
        <div className="space-y-3">
          {sorted.map(n => (
            <Card key={n.id} className="border-primary/10">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{n.title}</h3>
                      <Badge variant={n.published ? "default" : "secondary"}>
                        {n.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{n.content}</p>
                    {n.createdAt && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                        <Calendar size={11} />
                        <span>{new Date(n.createdAt).toLocaleDateString("gu-IN")}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Switch checked={!!n.published} onCheckedChange={() => handleToggle(n)} />
                    <Button size="sm" variant="ghost" onClick={() => openEdit(n)}><Pencil size={14} /></Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(n.id)}><Trash2 size={14} /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? "સૂચના સંપાદિત" : "નવી સૂચના"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>શીર્ષક *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="સૂચનાનું શીર્ષક" /></div>
            <div><Label>વિગત *</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="સૂચનાની વિગત..." className="min-h-[120px]" /></div>
            <div className="flex items-center gap-3">
              <Switch checked={form.published} onCheckedChange={v => setForm(f => ({ ...f, published: v }))} />
              <Label>Publish (સૌ ને દેખાય)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>રદ</Button>
            <Button onClick={handleSave} disabled={!form.title || !form.content}>
              {createMutation.isPending || updateMutation.isPending ? "..." : "સાચવો"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
