import { useState, useEffect } from 'react';
import { ticketService, passengerService, routeService } from '../services/api';
import { Plus, Ticket as TicketIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    passenger_id: '',
    route_id: '',
    travel_date: '',
    fare: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tRes, pRes, rRes] = await Promise.all([
        ticketService.getAll(),
        passengerService.getAll(),
        routeService.getAll()
      ]);
      setTickets(tRes.data);
      setPassengers(pRes.data);
      setRoutes(rRes.data);
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
      await ticketService.book(formData);
      toast.success('Ticket booked successfully');
      setShowModal(false);
      setFormData({ passenger_id: '', route_id: '', travel_date: '', fare: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to book ticket');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Tickets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Book Ticket
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">Passenger</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Fare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No tickets booked yet.</td>
                  </tr>
                ) : (
                  tickets.map((t) => {
                    const passenger = passengers.find(p => p.passenger_id === t.passenger_id);
                    const route = routes.find(r => r.route_id === t.route_id);
                    return (
                      <tr key={t.ticket_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <TicketIcon className="w-4 h-4 text-primary-500" />
                            {t.ticket_id}
                          </div>
                        </td>
                        <td className="px-6 py-4">{passenger ? `${passenger.first_name} ${passenger.last_name}` : t.passenger_id}</td>
                        <td className="px-6 py-4">{route ? route.route_name : t.route_id}</td>
                        <td className="px-6 py-4">{t.travel_date}</td>
                        <td className="px-6 py-4 font-medium text-emerald-600">${t.fare}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Book New Ticket</h3>
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Route</label>
                <select required value={formData.route_id} onChange={e => setFormData({...formData, route_id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                  <option value="">Select Route...</option>
                  {routes.map(r => (
                    <option key={r.route_id} value={r.route_id}>{r.route_name} ({r.start_point} to {r.end_point})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Travel Date</label>
                  <input type="date" required value={formData.travel_date} onChange={e => setFormData({...formData, travel_date: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fare ($)</label>
                  <input type="number" step="0.01" required value={formData.fare} onChange={e => setFormData({...formData, fare: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors">Book Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
