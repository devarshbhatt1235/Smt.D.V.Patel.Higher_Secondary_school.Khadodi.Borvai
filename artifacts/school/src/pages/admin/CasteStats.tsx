import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCasteStats, useUpdateCasteStats,
  getGetCasteStatsQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Form = { stBoys: string; stGirls: string; obcBoys: string; obcGirls: string; scBoys: string; scGirls: string; generalBoys: string; generalGirls: string; };
const empty: Form = { stBoys: "0", stGirls: "0", obcBoys: "0", obcGirls: "0", scBoys: "0", scGirls: "0", generalBoys: "0", generalGirls: "0" };

const COLORS = ["#0A2342", "#1a4a8c", "#2e7d32", "#e65100", "#6a1b9a", "#00838f", "#ad1457", "#f57f17"];

export default function AdminCasteStats() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: stats, isLoading } = useGetCasteStats();
  const updateMutation = useUpdateCasteStats();
  const [form, setForm] = useState<Form>(empty);

  useEffect(() => {
    if (stats) {
      setForm({
        stBoys: String(stats.stBoys ?? 0),
        stGirls: String(stats.stGirls ?? 0),
        obcBoys: String(stats.obcBoys ?? 0),
        obcGirls: String(stats.obcGirls ?? 0),
        scBoys: String(stats.scBoys ?? 0),
        scGirls: String(stats.scGirls ?? 0),
        generalBoys: String(stats.generalBoys ?? 0),
        generalGirls: String(stats.generalGirls ?? 0),
      });
    }
  }, [stats]);

  const f = (v: string) => ({ value: parseInt(v) || 0 });

  const chartData = [
    { name: "ST Boys", value: parseInt(form.stBoys) || 0 },
    { name: "ST Girls", value: parseInt(form.stGirls) || 0 },
    { name: "OBC Boys", value: parseInt(form.obcBoys) || 0 },
    { name: "OBC Girls", value: parseInt(form.obcGirls) || 0 },
    { name: "SC Boys", value: parseInt(form.scBoys) || 0 },
    { name: "SC Girls", value: parseInt(form.scGirls) || 0 },
    { name: "General Boys", value: parseInt(form.generalBoys) || 0 },
    { name: "General Girls", value: parseInt(form.generalGirls) || 0 },
  ].filter(d => d.value > 0);

  const total = chartData.reduce((s, d) => s + d.value, 0);

  const handleSave = () => {
    const data = {
      stBoys: parseInt(form.stBoys) || 0,
      stGirls: parseInt(form.stGirls) || 0,
      obcBoys: parseInt(form.obcBoys) || 0,
      obcGirls: parseInt(form.obcGirls) || 0,
      scBoys: parseInt(form.scBoys) || 0,
      scGirls: parseInt(form.scGirls) || 0,
      generalBoys: parseInt(form.generalBoys) || 0,
      generalGirls: parseInt(form.generalGirls) || 0,
    };
    updateMutation.mutate({ data }, {
      onSuccess: () => { toast({ title: "Saved" }); qc.invalidateQueries({ queryKey: getGetCasteStatsQueryKey() }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  const field = (key: keyof Form, label: string) => (
    <div key={key}>
      <Label>{label}</Label>
      <Input type="number" min={0} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">જ્ઞાતિ આંકડા</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>આંકડા ભરો</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
              <div className="space-y-4">
                <h3 className="font-semibold text-primary">ST (Scheduled Tribe)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {field("stBoys", "ST Boys")}
                  {field("stGirls", "ST Girls")}
                </div>
                <h3 className="font-semibold text-primary">OBC (Other Backward Class)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {field("obcBoys", "OBC Boys")}
                  {field("obcGirls", "OBC Girls")}
                </div>
                <h3 className="font-semibold text-primary">SC (Scheduled Caste)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {field("scBoys", "SC Boys")}
                  {field("scGirls", "SC Girls")}
                </div>
                <h3 className="font-semibold text-primary">General</h3>
                <div className="grid grid-cols-2 gap-4">
                  {field("generalBoys", "General Boys")}
                  {field("generalGirls", "General Girls")}
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-500 mb-3">કુલ: <strong>{total}</strong></p>
                  <Button onClick={handleSave} disabled={updateMutation.isPending} className="w-full">
                    {updateMutation.isPending ? "..." : "સાચવો"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Chart</CardTitle></CardHeader>
          <CardContent className="h-[400px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>ડેટા ઉમેરો ...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
