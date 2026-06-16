import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserSquare, Bell, Image as ImageIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  const statCards = [
    { title: "Total Students", value: stats?.totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Staff", value: stats?.totalStaff, icon: UserSquare, color: "text-green-600", bg: "bg-green-100" },
    { title: "Notices", value: stats?.totalNotices, icon: Bell, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Photos", value: stats?.totalPhotos, icon: ImageIcon, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : stat.value || 0}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Students by Class</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : stats?.studentsByClass && stats.studentsByClass.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.studentsByClass}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0'}}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No student data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
