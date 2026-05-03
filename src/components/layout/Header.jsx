import { Bell, Search, UserCircle } from 'lucide-react';
import { authService } from '../../services/api';

const Header = () => {
  const user = authService.getUser() || { username: 'Guest' };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            placeholder="Search anything..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-slate-500 p-1 rounded-full hover:bg-slate-100 transition-colors">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-slate-900">{user.username}</span>
            <span className="text-xs text-slate-500 capitalize">{user.role || 'Admin'}</span>
          </div>
          <UserCircle className="h-8 w-8 text-slate-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
