import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { Users, Ticket, Route, CreditCard, Activity, ArrowRight, Clock } from 'lucide-react';

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
    activities: []
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
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
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

      {/* Activity Feed Section */}
      <div className="mt-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
               <Activity className="w-5 h-5 text-primary-600" />
               Recent System Activity
            </h2>
            <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-200">
              Latest 10 actions
            </span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {stats.activities && stats.activities.length > 0 ? (
              stats.activities.map((act, idx) => (
                <div key={idx} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                  <div className={`p-3 rounded-xl shrink-0 ${act.type === 'ticket' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {act.type === 'ticket' ? <Ticket className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">
                        {act.type === 'ticket' ? `Ticket #${act.id} successfully booked` : `New Bus Pass #${act.id} issued`}
                      </p>
                      <span className="text-xs text-slate-400 font-mono">{new Date(act.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Passenger ID: {act.passenger_id}
                      </p>
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 uppercase tracking-tight font-semibold">
                        Status: <span className="text-emerald-600">Completed</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-primary-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
                <Activity className="w-12 h-12 opacity-20" />
                <p className="italic">No recent system activity recorded yet.</p>
              </div>
            )}
          </div>
          
          {stats.activities && stats.activities.length > 0 && (
            <div className="px-6 py-3 bg-slate-50/30 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 italic">Showing the most recent entries from your transport database</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
