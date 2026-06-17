import { useGetManagement, useGetSchoolInfo } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export default function Management() {
  const { data: members, isLoading } = useGetManagement();
  const { data: info, isLoading: infoLoading } = useGetSchoolInfo();

  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">સંચાલક મંડળ</h1>
          <p className="text-xl text-primary-foreground/80">School Management Committee</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              {infoLoading ? <Skeleton className="h-8 w-96 mx-auto" /> : info?.trustName}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              અમારી શ્રદ્ધેય સંચાલક સમિતિ, ગ્રામ્ય સ્તરે ઉચ્ચ ગુણવત્તાવાળું શિક્ષણ ઉપલબ્ધ
              કરાવવા અને આ સ્થાપનાઓ ચલાવવા સ્વૈચ્છિક આધારે સેવા આપે છે.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border-primary/10">
                    <CardContent className="p-6 text-center">
                      <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                      <Skeleton className="h-4 w-28 mx-auto mb-2" />
                      <Skeleton className="h-6 w-40 mx-auto" />
                    </CardContent>
                  </Card>
                ))
              : (members || []).map((member) => (
                  <Card key={member.id} className="border-primary/10 hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-primary/20"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <User size={32} />
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mb-1 font-medium">{member.designation}</div>
                      <div className="font-bold text-lg text-gray-900">{member.name}</div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary mb-6">અમારી ઓળખ</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: String(info?.established ?? "1972"), desc: "સ્થાપના વર્ષ" },
              { label: "9 – 12", desc: "ધોરણ" },
              { label: "ખાનપુર", desc: "તાલુકો" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-primary mb-1">
                  {infoLoading ? <Skeleton className="h-8 w-20 mx-auto" /> : item.label}
                </div>
                <div className="text-gray-500 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
