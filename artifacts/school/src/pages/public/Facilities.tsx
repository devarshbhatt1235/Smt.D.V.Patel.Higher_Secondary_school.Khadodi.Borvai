import { useGetSchoolInfo } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical, Monitor, Tv, Activity, Trophy, Dumbbell, Wifi, BookOpen, Shield } from "lucide-react";

const facilityIcons: Record<string, React.ElementType> = {
  "Modern Laboratory": FlaskConical,
  "Computer Room": Monitor,
  "Smart Board": Tv,
  "Kabaddi Ground": Activity,
  "Cricket Ground": Trophy,
  "Basketball Ground": Dumbbell,
  "Volleyball Ground": Activity,
};

const facilityColors = [
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-orange-100 text-orange-600",
  "bg-red-100 text-red-600",
  "bg-cyan-100 text-cyan-600",
  "bg-yellow-100 text-yellow-600",
  "bg-indigo-100 text-indigo-600",
];

export default function Facilities() {
  const { data: info, isLoading } = useGetSchoolInfo();

  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">સુવિધાઓ</h1>
          <p className="text-xl text-primary-foreground/80">School Facilities</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">આધુનિક સુવિધાઓ</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              અમારી શાળા વિદ્યાર્થીઓના સર્વાંગી વિકાસ માટે ઉચ્ચ ગુણવત્તાની સુવિધાઓ પ્રદાન કરે છે.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(info?.facilities || []).map((facility, i) => {
                const Icon = facilityIcons[facility] || BookOpen;
                const colorClass = facilityColors[i % facilityColors.length];
                return (
                  <Card key={i} className="border-primary/10 hover:shadow-lg transition-all group">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon size={30} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{facility}</h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">સ્વચ્છ, સુરક્ષિત અને પ્રેરક વાતાવરણ</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            અમારી શાળાનું વાતાવરણ વિદ્યાર્થીઓ માટે અભ્યાસ, ખેલ અને ચારિત્ર નિર્માણ
            — ત્રણેય ક્ષેત્રોમાં ઉત્કૃષ્ટ કામગીરી માટે પ્રોત્સાહક છે.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-3xl mx-auto">
            {[
              { icon: Shield, label: "સલામત વાતાવરણ" },
              { icon: Wifi, label: "ટેક્નોલોજી-સક્ષમ" },
              { icon: BookOpen, label: "ઉચ્ચ શૈક્ષણિક ધોરણ" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-6 flex flex-col items-center gap-3">
                <item.icon size={32} />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
