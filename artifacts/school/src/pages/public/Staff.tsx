import { useState } from "react";
import { useGetStaff } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Search, GraduationCap, BookOpen, Calendar } from "lucide-react";

export default function Staff() {
  const [search, setSearch] = useState("");
  const { data: staff, isLoading } = useGetStaff();

  const filtered = (staff || []).filter(s =>
    search === "" ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.qualification || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.subjectsTaught || []).some(sub => sub.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">સ્ટાફ ડિરેક્ટરી</h1>
          <p className="text-xl text-primary-foreground/80">Staff Directory</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="નામ, વિષય અથવા લાયકાત શોધો..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <User size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">કોઈ સ્ટાફ સભ્ય મળ્યા નહીં</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(member => (
                <Card key={member.id} className="border-primary/10 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <User size={24} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{member.name}</h3>
                        {member.qualification && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <GraduationCap size={14} />
                            <span>{member.qualification}</span>
                          </div>
                        )}
                        {member.subjectsTaught && member.subjectsTaught.length > 0 && (
                          <div className="flex items-start gap-1 text-sm text-primary mt-1">
                            <BookOpen size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{member.subjectsTaught.join(", ")}</span>
                          </div>
                        )}
                        {member.joiningDate && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                            <Calendar size={12} />
                            <span>Joined: {member.joiningDate}</span>
                          </div>
                        )}
                      </div>
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
