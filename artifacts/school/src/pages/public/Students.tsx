import { useState } from "react";
import { useGetStudents } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search } from "lucide-react";

const CLASSES = ["9A", "9B", "10A", "10B", "11", "12"];

export default function Students() {
  const [search, setSearch] = useState("");
  const [cls, setCls] = useState("all");
  const { data: students, isLoading } = useGetStudents();

  const filtered = (students || []).filter(s => {
    const matchClass = cls === "all" || s.class === cls;
    const matchSearch = search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.grNumber.includes(search);
    return matchClass && matchSearch;
  });

  const byClass = CLASSES.reduce((acc, c) => {
    acc[c] = (students || []).filter(s => s.class === c).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">વિદ્યાર્થી ડિરેક્ટરી</h1>
          <p className="text-xl text-primary-foreground/80">Student Directory</p>
        </div>
      </section>

      {/* Class stats bar */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {CLASSES.map(c => (
              <button
                key={c}
                onClick={() => setCls(cls === c ? "all" : c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  cls === c ? "bg-primary text-white shadow-md" : "bg-white text-gray-600 hover:bg-primary/10 hover:text-primary border"
                }`}
              >
                ધો. {c} ({byClass[c] || 0})
              </button>
            ))}
            <button
              onClick={() => setCls("all")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                cls === "all" ? "bg-primary text-white shadow-md" : "bg-white text-gray-600 hover:bg-primary/10 hover:text-primary border"
              }`}
            >
              બધા ({(students || []).length})
            </button>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="નામ અથવા GR નં. શોધો..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">કોઈ વિદ્યાર્થી મળ્યા નહીં</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(student => (
                <Card key={student.id} className="border-primary/10 hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm">
                      {student.class}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{student.name}</div>
                      <div className="text-xs text-gray-500">GR: {student.grNumber}</div>
                      {student.gender && (
                        <div className="text-xs text-gray-400">{student.gender === "M" ? "પુરૂષ" : "સ્ત્રી"}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
