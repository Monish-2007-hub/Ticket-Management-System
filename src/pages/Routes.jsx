import { useState, useEffect } from 'react';
import { routeService } from '../services/api';
import { Plus, Map } from 'lucide-react';
import toast from 'react-hot-toast';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    route_name: '',
    start_point: '',
    end_point: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const res = await routeService.getAll();
      setRoutes(res.data || []);
    } catch (error) {
      toast.error('Failed to load routes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await routeService.add(formData);
      toast.success('Route added successfully');
      setShowModal(false);
      setFormData({ route_name: '', start_point: '', end_point: '' });
      fetchRoutes();
    } catch (error) {
      toast.error('Failed to add route');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Routes</h1>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Route
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">No routes found.</div>
          ) : (
            routes.map((r) => (
              <div key={r.route_id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Map className="w-24 h-24 text-primary-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-primary-600 font-bold mb-4">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">{r.route_id}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{r.route_name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="font-medium text-slate-700">Start:</span> {r.start_point}
                    </div>
                    <div className="pl-1 border-l-2 border-dashed border-slate-300 ml-1 h-3"></div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="font-medium text-slate-700">End:</span> {r.end_point}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Add New Route</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Route Name</label>
                <input type="text" required placeholder="e.g. Downtown Express" value={formData.route_name} onChange={e => setFormData({...formData, route_name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Point</label>
                <input type="text" required placeholder="e.g. Central Station" value={formData.start_point} onChange={e => setFormData({...formData, start_point: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Point</label>
                <input type="text" required placeholder="e.g. Business Park" value={formData.end_point} onChange={e => setFormData({...formData, end_point: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors">Save Route</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
