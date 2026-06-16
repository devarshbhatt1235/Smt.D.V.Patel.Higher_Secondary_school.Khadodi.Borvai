import { Link, useLocation } from "wouter";
import { useGetSchoolInfo } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, MapPin, Phone, Mail } from "lucide-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: schoolInfo, isLoading } = useGetSchoolInfo();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/management", label: "Management" },
    { href: "/facilities", label: "Facilities" },
    { href: "/staff", label: "Staff" },
    { href: "/students", label: "Students" },
    { href: "/results", label: "Results" },
    { href: "/notices", label: "Notices" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 md:px-8 flex justify-between items-center text-sm border-b border-primary-foreground/10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><MapPin size={14} /> Khadodi Borvai, Gujarat</span>
          <span className="flex items-center gap-1"><Phone size={14} /> +91 00000 00000</span>
        </div>
        <div>
          <Link href="/admin/login" className="hover:underline opacity-80 hover:opacity-100 transition">Admin Login</Link>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
              <BookOpen size={32} />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-primary">
                {isLoading ? <Skeleton className="h-8 w-64 mb-1" /> : schoolInfo?.nameGujarati || "શ્રીમતી ડી વી પટેલ ઉ.મા.શાળા"}
              </h1>
              <div className="text-sm text-gray-600 font-medium">
                {isLoading ? <Skeleton className="h-4 w-48" /> : schoolInfo?.nameEnglish || "Smt. D. V. Patel High School"}
              </div>
            </div>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-1 md:gap-2">
            {links.map(link => (
              <Link key={link.href} href={link.href}>
                <span className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === link.href ? "bg-primary text-white" : "text-gray-600 hover:bg-primary/10 hover:text-primary cursor-pointer"
                }`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen size={24} />
                <h3 className="text-xl font-bold">{schoolInfo?.nameGujarati || "શ્રીમતી ડી વી પટેલ ઉ.મા.શાળા"}</h3>
              </div>
              <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4">
                A recognized high school serving the community with dedication to quality education and holistic development.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-primary-foreground/20 pb-2">Quick Links</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {links.slice(1, 9).map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-primary-foreground/80 hover:text-white hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-primary-foreground/20 pb-2">Contact Us</h3>
              <div className="space-y-3 text-sm text-primary-foreground/80">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{schoolInfo?.address || "Khadodi Borvai, Gujarat"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>+91 00000 00000</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>dvpatelhighschool@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Smt. D. V. Patel High School. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
