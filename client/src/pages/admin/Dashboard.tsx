import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMovies } from "@/hooks/use-movies";
import { Film, DollarSign, TrendingUp, Users } from "lucide-react";

export default function AdminDashboard() {
  const { data: movies } = useMovies();

  const totalMovies = movies?.length || 0;
  const activeMovies = movies?.filter(m => m.status === 'Running').length || 0;
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMovies}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Now</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMovies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (Est)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,240Cr</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5k</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
         <CardHeader>
            <CardTitle>System Status</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <span className="text-sm font-medium">API Operational</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <span className="text-sm font-medium">Database Connected</span>
            </div>
         </CardContent>
      </Card>
    </AdminLayout>
  );
}
