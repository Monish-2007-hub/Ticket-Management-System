import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { Users, Ticket, Route, CreditCard } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPassengers: 0,
    totalTickets: 0,
    totalRoutes: 0,
    totalPasses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Passengers" 
          value={stats.totalPassengers} 
          icon={Users} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Total Tickets" 
          value={stats.totalTickets} 
          icon={Ticket} 
          colorClass="bg-emerald-100 text-emerald-600" 
        />
        <StatCard 
          title="Active Routes" 
          value={stats.totalRoutes} 
          icon={Route} 
          colorClass="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Active Bus Passes" 
          value={stats.totalPasses} 
          icon={CreditCard} 
          colorClass="bg-amber-100 text-amber-600" 
        />
      </div>

      {/* Placeholder for charts or recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-slate-500">
           <p className="text-lg font-medium">Weekly Ticket Sales Chart</p>
           <p className="text-sm">(Data visualization placeholder)</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-slate-500">
           <p className="text-lg font-medium">Recent Activity</p>
           <p className="text-sm">(Activity feed placeholder)</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
