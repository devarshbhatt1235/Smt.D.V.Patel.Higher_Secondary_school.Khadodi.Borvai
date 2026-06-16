import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, Users, UserSquare, Medal, Bell, Image as ImageIcon, Settings, LogOut, Info, Map, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { admin, setToken, isLoading } = useAuth();

  const handleLogout = () => {
    setToken(null);
    setLocation("/admin/login");
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/staff", label: "Staff Directory", icon: UserSquare },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/top-students", label: "Top Students", icon: Medal },
    { href: "/admin/notices", label: "Notices", icon: Bell },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/admin/caste-stats", label: "Caste Stats", icon: PieChart },
    { href: "/admin/school-info", label: "School Info", icon: Info },
    { href: "/admin/contact", label: "Contact Info", icon: Map },
  ];

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-[100dvh] flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col hidden md:flex sticky top-0 h-[100dvh]">
        <div className="p-6 border-b border-primary-foreground/10">
          <h2 className="text-xl font-bold">Admin Portal</h2>
          <p className="text-sm text-primary-foreground/70">DV Patel High School</p>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href}>
                <span className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isActive ? "bg-primary-foreground/10 text-white" : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-white"
                }`}>
                  <Icon size={18} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-primary-foreground/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              {admin?.name?.[0] || 'A'}
            </div>
            <div className="text-sm">
              <div className="font-medium">{admin?.name || "Administrator"}</div>
              <div className="text-xs text-primary-foreground/60">{admin?.email}</div>
            </div>
          </div>
          <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-y-auto">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find(i => location.startsWith(i.href))?.label || "Admin"}
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-primary hover:underline font-medium">View Website</Link>
          </div>
        </header>
        
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
