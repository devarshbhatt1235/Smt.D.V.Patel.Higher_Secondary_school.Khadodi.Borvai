import { useGetSchoolInfo, useGetDashboardStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Users, UserSquare, Bell, Image as ImageIcon, MapPin, Building, ChevronRight } from "lucide-react";

export default function Home() {
  const { data: schoolInfo, isLoading: isLoadingInfo } = useGetSchoolInfo();
  const { data: stats, isLoading: isLoadingStats } = useGetDashboardStats();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white text-primary rounded-full flex items-center justify-center mb-6 shadow-xl">
            <BookOpen size={48} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {isLoadingInfo ? <Skeleton className="h-12 w-96 mx-auto bg-primary-foreground/20" /> : schoolInfo?.nameGujarati}
          </h1>
          <div className="text-xl md:text-2xl text-primary-foreground/90 font-medium max-w-2xl mb-8">
            {isLoadingInfo ? <Skeleton className="h-8 w-64 mx-auto bg-primary-foreground/20" /> : schoolInfo?.nameEnglish}
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/about">
              <Button size="lg" variant="secondary" className="font-semibold px-8 text-primary">
                About Us
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="font-semibold px-8 text-white border-white hover:bg-white/10">
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold text-primary mb-2">
                {isLoadingInfo ? "-" : schoolInfo?.established}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Established</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-primary mb-2">
                {isLoadingStats ? "-" : stats?.totalStudents || 0}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Students</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-primary mb-2">
                {isLoadingStats ? "-" : stats?.totalStaff || 0}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Staff</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Dedication</div>
            </div>
          </div>
        </div>
      </section>

      {/* Principal Message & Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <BookOpen className="text-primary" /> Principal's Message
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700">
                {isLoadingInfo ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                ) : (
                  <div className="whitespace-pre-line italic text-gray-700">
                    "{schoolInfo?.principalMessage || 'Welcome to our school. We strive for excellence in education and character building.'}"
                  </div>
                )}
              </div>
              <div className="mt-6 font-semibold text-primary">
                — {isLoadingInfo ? <Skeleton className="h-4 w-32 inline-block" /> : schoolInfo?.principalName}
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quality Education Since {schoolInfo?.established}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Managed by {schoolInfo?.trustName}, our institution has been a cornerstone of learning in the Khadodi Borvai region. We provide a nurturing environment where students can achieve their full potential.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Link href="/facilities">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/10">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <Building />
                      </div>
                      <div className="font-semibold text-gray-800">Facilities</div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/staff">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/10">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <UserSquare />
                      </div>
                      <div className="font-semibold text-gray-800">Our Staff</div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links / Explore */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Explore Our School</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Notice Board", icon: Bell, href: "/notices", color: "bg-blue-100 text-blue-600" },
              { title: "Student Directory", icon: Users, href: "/students", color: "bg-green-100 text-green-600" },
              { title: "Photo Gallery", icon: ImageIcon, href: "/gallery", color: "bg-purple-100 text-purple-600" },
              { title: "Contact Us", icon: MapPin, href: "/contact", color: "bg-orange-100 text-orange-600" },
            ].map((item, i) => (
              <Link key={i} href={item.href}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-gray-100 group h-full">
                  <CardContent className="p-8 flex flex-col items-center text-center justify-center">
                    <div className={`p-4 rounded-full ${item.color} mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon size={32} />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
