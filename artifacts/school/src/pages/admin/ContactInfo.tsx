import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetContact, useUpdateContact,
  getGetContactQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type Form = { phone: string; email: string; mapLink: string; };
const empty: Form = { phone: "", email: "", mapLink: "" };

export default function AdminContactInfo() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: contact, isLoading } = useGetContact();
  const updateMutation = useUpdateContact();
  const [form, setForm] = useState<Form>(empty);

  useEffect(() => {
    if (contact) {
      setForm({ phone: contact.phone || "", email: contact.email || "", mapLink: (contact as any).mapLink || "" });
    }
  }, [contact]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    updateMutation.mutate({
      data: { phone: form.phone || undefined, email: form.email || undefined, mapLink: form.mapLink || undefined }
    }, {
      onSuccess: () => { toast({ title: "Saved" }); qc.invalidateQueries({ queryKey: getGetContactQueryKey() }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  if (isLoading) return <Skeleton className="h-48 w-full rounded-xl" />;

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-xl font-bold text-gray-900">સંપર્ક માહિતી</h2>
      <Card>
        <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>ફોન નં.</Label>
            <Input value={form.phone} onChange={set("phone")} placeholder="+91 00000 00000" />
          </div>
          <div>
            <Label>ઇ-મેઇલ</Label>
            <Input type="email" value={form.email} onChange={set("email")} placeholder="school@example.com" />
          </div>
          <div>
            <Label>Google Maps Link</Label>
            <Input value={form.mapLink} onChange={set("mapLink")} placeholder="https://maps.google.com/..." />
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="w-full">
            {updateMutation.isPending ? "..." : "સાચવો"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
