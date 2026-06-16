import { useGetSchoolInfo } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, MapPin, Award, Users } from "lucide-react";

export default function About() {
  const { data: info, isLoading } = useGetSchoolInfo();

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">અમારા વિશે</h1>
          <p className="text-xl text-primary-foreground/80">About Our School</p>
        </div>
      </section>

      {/* School History */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">શાળા પરિચય</h2>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    <strong>{info?.nameGujarati}</strong> — આ શાળા ઇ.સ. {info?.established} થી ખડોદી-બોરવાઈ
                    સહિત સમગ્ર ખાનપુર તાલુકાના વિદ્યાર્થીઓને ઉચ્ચ ગુણવત્તાવાળું શિક્ષણ આપે છે.
                  </p>
                  <p>
                    {info?.trustName} દ્વારા સંચાલિત આ શાળા ધોરણ ૯ થી ૧૨ ના વિદ્યાર્થીઓ માટે
                    ઉચ્ચ માધ્યમિક સ્તર પર ગુણવત્તાસભર શિક્ષણ પ્રદાન કરે છે.
                  </p>
                  <p>
                    અમારો ઉદ્દેશ્ય દરેક વિદ્યાર્થીનો સર્વાંગી વિકાસ — શૈક્ષણિક, શારીરિક અને
                    નૈતિક — સુનિશ્ચિત કરવાનો છે.
                  </p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "સ્થાપના વર્ષ", value: info?.established, icon: Calendar },
                { label: "સ્થળ", value: "ખડોદી બોરવાઈ", icon: MapPin },
                { label: "ધોરણ", value: "9 – 12", icon: BookOpen },
                { label: "ઉત્કૃષ્ટ ફળ", value: "100%", icon: Award },
              ].map((item, i) => (
                <Card key={i} className="border-primary/10">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <item.icon size={24} />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {isLoading ? <Skeleton className="h-6 w-16 mx-auto" /> : item.value}
                    </div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principal Message */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-primary text-center mb-10">મુખ્ય શિક્ષકનો સંદેશ</h2>
          <Card className="border-primary/10 shadow-md">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={28} />
                </div>
                <div>
                  <div className="font-bold text-xl text-primary">
                    {isLoading ? <Skeleton className="h-6 w-48" /> : info?.principalName}
                  </div>
                  <div className="text-gray-500 text-sm">મુખ્ય શિક્ષક (Principal)</div>
                </div>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <blockquote className="text-gray-700 leading-relaxed italic text-lg border-l-4 border-primary pl-6">
                  "{info?.principalMessage}"
                </blockquote>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Info */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">ટ્રસ્ટ / સંચાલક સમિતિ</h2>
          {isLoading ? (
            <Skeleton className="h-6 w-64 mx-auto bg-primary-foreground/20" />
          ) : (
            <p className="text-xl text-primary-foreground/90 font-medium">{info?.trustName}</p>
          )}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { role: "પ્રમુખ (President)", name: info?.presidentName },
              { role: "આચાર્ય (Principal)", name: info?.principalName },
              { role: "મંત્રી (Secretary)", name: info?.secretaryName },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-6">
                <div className="text-primary-foreground/70 text-sm mb-2">{item.role}</div>
                <div className="font-bold text-lg">
                  {isLoading ? <Skeleton className="h-5 w-40 mx-auto bg-primary-foreground/20" /> : item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
