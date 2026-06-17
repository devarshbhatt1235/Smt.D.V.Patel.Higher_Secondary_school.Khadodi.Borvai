import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import Management from "@/pages/public/Management";
import Facilities from "@/pages/public/Facilities";
import Staff from "@/pages/public/Staff";
import Students from "@/pages/public/Students";
import Results from "@/pages/public/Results";
import Notices from "@/pages/public/Notices";
import Gallery from "@/pages/public/Gallery";
import Contact from "@/pages/public/Contact";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminStaff from "@/pages/admin/Staff";
import AdminStudents from "@/pages/admin/Students";
import AdminTopStudents from "@/pages/admin/TopStudents";
import AdminNotices from "@/pages/admin/Notices";
import AdminGallery from "@/pages/admin/Gallery";
import AdminCasteStats from "@/pages/admin/CasteStats";
import AdminSchoolInfo from "@/pages/admin/SchoolInfo";
import AdminContactInfo from "@/pages/admin/ContactInfo";
import AdminManagement from "@/pages/admin/Management";

import { useAuth } from "@/hooks/use-auth";

const queryClient = new QueryClient();

function PublicRoutes() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/management" component={Management} />
        <Route path="/facilities" component={Facilities} />
        <Route path="/staff" component={Staff} />
        <Route path="/students" component={Students} />
        <Route path="/results" component={Results} />
        <Route path="/notices" component={Notices} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function ProtectedAdminRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/admin/login" />;
  }

  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/staff" component={AdminStaff} />
        <Route path="/admin/students" component={AdminStudents} />
        <Route path="/admin/top-students" component={AdminTopStudents} />
        <Route path="/admin/notices" component={AdminNotices} />
        <Route path="/admin/gallery" component={AdminGallery} />
        <Route path="/admin/caste-stats" component={AdminCasteStats} />
        <Route path="/admin/school-info" component={AdminSchoolInfo} />
        <Route path="/admin/contact" component={AdminContactInfo} />
        <Route path="/admin/management" component={AdminManagement} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/*" component={ProtectedAdminRoutes} />
      <Route path="/*" component={PublicRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
