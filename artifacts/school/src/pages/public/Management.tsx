import { useGetSchoolInfo } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export default function Management() {
  const { data: info, isLoading } = useGetSchoolInfo();

  const members = [
    { role: "પ્રમુખ (President)", name: info?.presidentName, color: "bg-blue-100 text-blue-700" },
    { role: "ઉપ-પ્રમુખ (Vice President)", name: "—", color: "bg-indigo-100 text-indigo-700" },
    { role: "મંત્રી (Secretary)", name: info?.secretaryName, color: "bg-green-100 text-green-700" },
    { role: "ખજાનચી (Treasurer)", name: "—", color: "bg-yellow-100 text-yellow-700" },
    { role: "આચાર્ય (Principal)", name: info?.principalName, color: "bg-primary/10 text-primary" },
  ];

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
              {isLoading ? <Skeleton className="h-8 w-96 mx-auto" /> : info?.trustName}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              અમારી શ્રદ્ધેય સંચાલક સમિતિ, ગ્રામ્ય સ્તરે ઉચ્ચ ગુણવત્તાવાળું શિક્ષણ ઉપલબ્ધ
              કરાવવા અને આ સ્થાપનાઓ ચલાવવા સ્વૈચ્છિક આધારે સેવા આપે છે.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {members.map((member, i) => (
              <Card key={i} className="border-primary/10 hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <User size={28} />
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{member.role}</div>
                  <div className="font-bold text-lg text-gray-900">
                    {isLoading ? <Skeleton className="h-6 w-36 mx-auto" /> : member.name}
                  </div>
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
              { label: "ઇ.સ.", value: info?.established, desc: "સ્થાપના વર્ષ" },
              { label: "9 – 12", value: "", desc: "ધોરણ" },
              { label: "ખાનપુર", value: "", desc: "તાલુકો" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-primary mb-1">
                  {isLoading ? <Skeleton className="h-8 w-20 mx-auto" /> : item.label || item.value}
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
