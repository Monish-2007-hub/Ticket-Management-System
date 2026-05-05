import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { Users, Ticket, Route, CreditCard, Activity, ArrowRight } from 'lucide-react';

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
    weeklySales: [],
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

  const maxSales = Math.max(...(stats.weeklySales?.map(s => s.count) || [0]), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <div className="text-sm text-slate-500">Last updated: {new Date().toLocaleTimeString()}</div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Weekly Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
             <Activity className="w-5 h-5 text-primary-600" />
             Weekly Ticket Sales
          </h2>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {stats.weeklySales && stats.weeklySales.length > 0 ? (
              stats.weeklySales.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-primary-500 rounded-t-md transition-all duration-500 hover:bg-primary-600 relative group"
                    style={{ height: `${(item.count / maxSales) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{item.day}</span>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 italic">No sales data for the past week</div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
             <Activity className="w-5 h-5 text-primary-600" />
             Recent Activity
          </h2>
          <div className="space-y-4">
            {stats.activities && stats.activities.length > 0 ? (
              stats.activities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-lg shrink-0 ${act.type === 'ticket' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {act.type === 'ticket' ? <Ticket className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {act.type === 'ticket' ? `Ticket #${act.id} Booked` : `Pass #${act.id} Issued`}
                    </p>
                    <p className="text-xs text-slate-500">Passenger ID: {act.passenger_id}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(act.date).toLocaleDateString()}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 italic">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
