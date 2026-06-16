import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetGallery, useCreateGalleryPhoto, useDeleteGalleryPhoto,
  getGetGalleryQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/upload";
import { Plus, Trash2, Image as ImageIcon, Upload } from "lucide-react";

export default function AdminGallery() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: photos, isLoading } = useGetGallery();
  const createMutation = useCreateGalleryPhoto();
  const deleteMutation = useDeleteGalleryPhoto();

  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: getGetGalleryQueryKey() });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setImageUrl(url);
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!imageUrl) return;
    createMutation.mutate({ data: { imageUrl, caption: caption || undefined } }, {
      onSuccess: () => { toast({ title: "Photo added" }); refresh(); setOpen(false); setCaption(""); setImageUrl(""); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("ફોટો ડિલીટ કરવો?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { toast({ title: "Deleted" }); refresh(); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">ફોટો ગૅલેરી ({(photos || []).length})</h2>
        <Button onClick={() => { setOpen(true); setCaption(""); setImageUrl(""); }} className="gap-2">
          <Plus size={16} /> ફોટો ઉમેરો
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      ) : !photos || photos.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p>કોઈ ફોટો નહીં</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <Card key={photo.id} className="group overflow-hidden border-primary/10">
              <div className="relative aspect-square">
                <img src={photo.imageUrl} alt={photo.caption || ""} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(photo.id)}
                    className="gap-1"
                  >
                    <Trash2 size={14} /> ડિલીટ
                  </Button>
                </div>
              </div>
              {photo.caption && (
                <CardContent className="p-2 text-xs text-gray-600 text-center">{photo.caption}</CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>ફોટો ઉમેરો</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>ફોટો અપલોડ કરો *</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="photo-upload" disabled={uploading} />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  {uploading ? (
                    <p className="text-sm text-gray-500">Uploading...</p>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="preview" className="w-full max-h-48 object-contain rounded" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Upload size={32} />
                      <p className="text-sm">ફોટો પસંદ કરો</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <div>
              <Label>Caption (ઐચ્છિક)</Label>
              <Input value={caption} onChange={e => setCaption(e.target.value)} placeholder="ફોટોની ટૂંક નોંધ..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>રદ</Button>
            <Button onClick={handleSave} disabled={!imageUrl || createMutation.isPending}>
              {createMutation.isPending ? "..." : "ઉમેરો"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
