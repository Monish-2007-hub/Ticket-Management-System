import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Ticket, Route, BusFront, CreditCard, LogOut } from 'lucide-react';
import { authService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Passengers', path: '/passengers', icon: Users },
  { name: 'Tickets', path: '/tickets', icon: Ticket },
  { name: 'Routes', path: '/routes', icon: Route },
  { name: 'Buses', path: '/buses', icon: BusFront },
  { name: 'Bus Pass', path: '/passes', icon: CreditCard },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <BusFront className="w-6 h-6 text-primary-500" />
          <span>TransitAdmin</span>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600/10 text-primary-400'
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
