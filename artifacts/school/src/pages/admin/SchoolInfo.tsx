import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetSchoolInfo, useUpdateSchoolInfo,
  getGetSchoolInfoQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type Form = {
  nameGujarati: string; nameEnglish: string; trustName: string; address: string;
  established: string; principalName: string; presidentName: string; secretaryName: string;
  principalMessage: string; facilities: string;
};
const empty: Form = { nameGujarati: "", nameEnglish: "", trustName: "", address: "", established: "", principalName: "", presidentName: "", secretaryName: "", principalMessage: "", facilities: "" };

export default function AdminSchoolInfo() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: info, isLoading } = useGetSchoolInfo();
  const updateMutation = useUpdateSchoolInfo();
  const [form, setForm] = useState<Form>(empty);

  useEffect(() => {
    if (info) {
      setForm({
        nameGujarati: info.nameGujarati || "",
        nameEnglish: info.nameEnglish || "",
        trustName: info.trustName || "",
        address: info.address || "",
        established: String(info.established || ""),
        principalName: info.principalName || "",
        presidentName: info.presidentName || "",
        secretaryName: info.secretaryName || "",
        principalMessage: info.principalMessage || "",
        facilities: (info.facilities || []).join(", "),
      });
    }
  }, [info]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    updateMutation.mutate({
      data: {
        nameGujarati: form.nameGujarati || undefined,
        nameEnglish: form.nameEnglish || undefined,
        trustName: form.trustName || undefined,
        address: form.address || undefined,
        established: form.established ? parseInt(form.established) : undefined,
        principalName: form.principalName || undefined,
        presidentName: form.presidentName || undefined,
        secretaryName: form.secretaryName || undefined,
        principalMessage: form.principalMessage || undefined,
        facilities: form.facilities ? form.facilities.split(",").map(s => s.trim()).filter(Boolean) : undefined,
      }
    }, {
      onSuccess: () => { toast({ title: "Saved" }); qc.invalidateQueries({ queryKey: getGetSchoolInfoQueryKey() }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900">શાળાની માહિતી</h2>

      <Card>
        <CardHeader><CardTitle>મૂળભૂત માહિતી</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>શાળાનું નામ (ગુજરાતી)</Label><Input value={form.nameGujarati} onChange={set("nameGujarati")} /></div>
          <div><Label>School Name (English)</Label><Input value={form.nameEnglish} onChange={set("nameEnglish")} /></div>
          <div><Label>ટ્રસ્ટ / સંચાલક સમિતિ</Label><Input value={form.trustName} onChange={set("trustName")} /></div>
          <div><Label>સ્થાપના વર્ષ</Label><Input type="number" value={form.established} onChange={set("established")} /></div>
          <div><Label>સરનામું</Label><Textarea value={form.address} onChange={set("address")} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>સંચાલન</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>આચાર્ય (Principal)</Label><Input value={form.principalName} onChange={set("principalName")} /></div>
          <div><Label>પ્રમુખ (President)</Label><Input value={form.presidentName} onChange={set("presidentName")} /></div>
          <div><Label>મંત્રી (Secretary)</Label><Input value={form.secretaryName} onChange={set("secretaryName")} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>આચાર્ય સંદેશ</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={form.principalMessage} onChange={set("principalMessage")} placeholder="આચાર્ય સ્વ-ઓળખ / સંદેશ..." className="min-h-[140px]" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>સુવિધાઓ</CardTitle></CardHeader>
        <CardContent>
          <Label className="block mb-2 text-sm text-gray-500">Comma-separated list</Label>
          <Textarea value={form.facilities} onChange={set("facilities")} placeholder="Modern Laboratory, Computer Room, Cricket Ground, ..." className="min-h-[80px]" />
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateMutation.isPending} className="w-full">
        {updateMutation.isPending ? "સાચવી રહ્યા..." : "બધી માહિતી સાચવો"}
      </Button>
    </div>
  );
}
