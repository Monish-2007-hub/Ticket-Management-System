import { useState, useEffect } from 'react';
import { passService, passengerService } from '../services/api';
import { Plus, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const BusPasses = () => {
  const [passes, setPasses] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    passenger_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    expiry_date: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [passRes, passengRes] = await Promise.all([
        passService.getAll(),
        passengerService.getAll()
      ]);
      setPasses(passRes.data);
      setPassengers(passengRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await passService.issue(formData);
      toast.success('Bus pass issued successfully');
      setShowModal(false);
      setFormData({ 
        passenger_id: '', 
        issue_date: new Date().toISOString().split('T')[0], 
        expiry_date: '' 
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to issue pass');
    }
  };

  const getStatusColor = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    if (expiry < today) return 'bg-red-100 text-red-700';
    
    const diffTime = Math.abs(expiry - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  const getStatusText = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    if (expiry < today) return 'Expired';
    
    const diffTime = Math.abs(expiry - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 'Expiring Soon';
    return 'Active';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Bus Passes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Issue Pass
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {passes.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">No bus passes issued yet.</div>
          ) : (
            passes.map((p) => {
              const passenger = passengers.find(pass => pass.passenger_id === p.passenger_id);
              const passengerName = passenger ? `${passenger.first_name} ${passenger.last_name}` : p.passenger_id;
              
              return (
                <div key={p.pass_id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-1 shadow-lg text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                     <CreditCard className="w-32 h-32 transform rotate-12 translate-x-8 -translate-y-8" />
                   </div>
                   <div className="border border-slate-700/50 rounded-lg p-5 h-full flex flex-col justify-between backdrop-blur-sm relative z-10">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Pass ID</p>
                          <p className="font-mono text-lg text-primary-400 font-bold">{p.pass_id}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(p.expiry_date)}`}>
                          {getStatusText(p.expiry_date)}
                        </span>
                     </div>
                     <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Passenger</p>
                        <p className="font-medium text-lg truncate" title={passengerName}>{passengerName}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-700">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Issued</p>
                          <p className="text-sm">{p.issue_date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Expires</p>
                          <p className="text-sm">{p.expiry_date}</p>
                        </div>
                     </div>
                   </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Issue Pass Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Issue New Bus Pass</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Passenger</label>
                <select required value={formData.passenger_id} onChange={e => setFormData({...formData, passenger_id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                  <option value="">Select Passenger...</option>
                  {passengers.map(p => (
                    <option key={p.passenger_id} value={p.passenger_id}>{p.first_name} {p.last_name} ({p.passenger_id})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
                  <input type="date" required value={formData.issue_date} onChange={e => setFormData({...formData, issue_date: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input type="date" required value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors">Issue Pass</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusPasses;
