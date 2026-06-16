import { useGetNotices } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Calendar } from "lucide-react";

export default function Notices() {
  const { data: notices, isLoading } = useGetNotices();

  const sorted = [...(notices || [])].sort(
    (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
  );

  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">સૂચના ફળક</h1>
          <p className="text-xl text-primary-foreground/80">Notice Board</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Bell size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">કોઈ સૂચના ઉપલબ્ધ નથી</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map((notice, i) => (
                <Card key={notice.id} className={`border-l-4 ${i === 0 ? "border-l-primary" : "border-l-gray-200"} hover:shadow-md transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${i === 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}>
                        <Bell size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">{notice.title}</h3>
                          {i === 0 && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">નવું</span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-2 leading-relaxed">{notice.content}</p>
                        {notice.createdAt && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                            <Calendar size={12} />
                            <span>{new Date(notice.createdAt).toLocaleDateString("gu-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
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
