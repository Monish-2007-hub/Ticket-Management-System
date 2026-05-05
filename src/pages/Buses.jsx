import { useState, useEffect } from 'react';
import { busService, routeService } from '../services/api';
import { Bus, Users, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bus_type_id: '',
    route_id: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [busRes, routeRes] = await Promise.all([
        busService.getAll(),
        routeService.getAll()
      ]);
      setBuses(busRes.data || []);
      setRoutes(routeRes.data || []);
    } catch (error) {
      toast.error('Failed to load fleet data');
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
      await busService.add(formData);
      toast.success('Bus added to fleet');
      setShowModal(false);
      setFormData({ bus_type_id: '', route_id: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add bus');
    }
  };

  // Generate a mock seat layout for the selected bus
  const renderSeatLayout = (capacity) => {
    const seats = [];
    for (let i = 1; i <= capacity; i++) {
      const isBooked = Math.random() > 0.7; 
      seats.push(
        <div 
          key={i} 
          className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-t-lg rounded-b-sm text-xs font-medium border-2 transition-colors cursor-pointer
            ${isBooked 
              ? 'bg-slate-200 border-slate-300 text-slate-500' 
              : 'bg-white border-primary-500 text-primary-700 hover:bg-primary-50'
            }`}
          title={isBooked ? 'Booked' : 'Available'}
        >
          {i}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-sm mx-auto">
        {seats.map((seat, index) => (
          <div key={index} className={(index + 1) % 4 === 2 ? 'mr-6' : ''}>
            {seat}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Bus Fleet & Seating</h1>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Bus
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fleet List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Our Fleet</h2>
            {buses.length === 0 ? (
              <p className="text-slate-500 italic">No buses in fleet.</p>
            ) : (
              buses.map(bus => (
                <div 
                  key={bus.bus_id} 
                  onClick={() => setSelectedBus(bus)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                    selectedBus?.bus_id === bus.bus_id ? 'border-primary-500 ring-1 ring-primary-500 shadow-md' : 'border-slate-200 hover:border-primary-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${selectedBus?.bus_id === bus.bus_id ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Bus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Bus {bus.bus_number || bus.bus_id}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {bus.capacity} Seats • Route {bus.route_id}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Seat Layout View */}
          <div className="lg:col-span-2">
            {selectedBus ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Bus {selectedBus.bus_number || selectedBus.bus_id} Layout</h2>
                    <p className="text-slate-500">Route {selectedBus.route_id} • {selectedBus.status}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-primary-500 rounded-sm"></div> Available</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-200 border-2 border-slate-300 rounded-sm"></div> Booked</div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-8 rounded-3xl border-8 border-slate-200 relative w-full max-w-lg">
                  <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 bg-slate-200 rounded-full border border-slate-300">
                     <div className="w-6 h-6 rounded-t-lg rounded-b-sm bg-slate-400"></div>
                  </div>
                  <div className="mt-16">
                    {renderSeatLayout(selectedBus.capacity)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-slate-500 h-full min-h-[400px]">
                <Bus className="w-16 h-16 mb-4 text-slate-300" />
                <p className="text-lg">Select a bus from the fleet to view its seating layout</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Bus Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Add New Bus</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bus Type ID</label>
                <input type="number" required value={formData.bus_type_id} onChange={e => setFormData({...formData, bus_type_id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Route</label>
                <select required value={formData.route_id} onChange={e => setFormData({...formData, route_id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                  <option value="">Select Route...</option>
                  {routes.map(r => (
                    <option key={r.route_id} value={r.route_id}>{r.route_name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors">Add Bus</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buses;
