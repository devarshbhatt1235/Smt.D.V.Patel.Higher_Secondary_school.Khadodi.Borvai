import { useState } from "react";
import { useGetTopStudents } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Medal, Trophy, Star } from "lucide-react";

const CLASSES = ["9A", "9B", "10A", "10B", "11", "12"];

const rankColors = [
  "bg-yellow-400 text-yellow-900",
  "bg-gray-300 text-gray-800",
  "bg-amber-600 text-white",
];
const rankLabels = ["🥇 પ્રથમ", "🥈 દ્વિતીય", "🥉 તૃતીય"];

export default function Results() {
  const [cls, setCls] = useState("all");
  const { data: topStudents, isLoading } = useGetTopStudents();

  const filtered = (topStudents || []).filter(s => cls === "all" || s.class === cls);
  const years = [...new Set((topStudents || []).map(s => s.year))].sort().reverse();

  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">તેજસ્વી વિદ્યાર્થીઓ</h1>
          <p className="text-xl text-primary-foreground/80">Top Students & Results</p>
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setCls("all")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                cls === "all" ? "bg-primary text-white shadow-md" : "bg-white text-gray-600 hover:bg-primary/10 border"
              }`}
            >
              બધા ધોરણ
            </button>
            {CLASSES.map(c => (
              <button
                key={c}
                onClick={() => setCls(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  cls === c ? "bg-primary text-white shadow-md" : "bg-white text-gray-600 hover:bg-primary/10 border"
                }`}
              >
                ધો. {c}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Trophy size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">કોઈ ડેટા મળ્યો નહીં</p>
            </div>
          ) : (
            <div className="space-y-10">
              {years.map(year => {
                const yearStudents = filtered.filter(s => s.year === year);
                if (yearStudents.length === 0) return null;
                return (
                  <div key={year}>
                    <h2 className="text-2xl font-bold text-primary text-center mb-6 flex items-center justify-center gap-2">
                      <Star size={24} /> શૈ. વ. {year}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      {yearStudents.sort((a, b) => a.rank - b.rank).map(student => (
                        <Card key={student.id} className={`border-0 shadow-md overflow-hidden`}>
                          <div className={`${rankColors[(student.rank - 1)] || "bg-primary/10 text-primary"} px-4 py-2 text-center font-bold`}>
                            {rankLabels[student.rank - 1] || `${student.rank}મો ક્રમ`}
                          </div>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                              <Medal size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                            {student.fatherName && (
                              <p className="text-sm text-gray-500 mt-1">પિता: {student.fatherName}</p>
                            )}
                            <p className="text-sm text-primary font-medium mt-1">ધો. {student.class}</p>
                            {student.percentage != null && (
                              <div className="mt-3 bg-primary/5 rounded-lg py-2">
                                <span className="text-2xl font-bold text-primary">{student.percentage}%</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
