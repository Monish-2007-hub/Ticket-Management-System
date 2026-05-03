// Mock API Service using localStorage

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getStorageItem = (key, defaultVal) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultVal;
};

const setStorageItem = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// Initialize mock data if empty
if (!localStorage.getItem('passengers')) {
  setStorageItem('passengers', [
    { passenger_id: 'P001', first_name: 'John', last_name: 'Doe', date_of_birth: '1990-05-15', passenger_type: 'Regular' },
    { passenger_id: 'P002', first_name: 'Jane', last_name: 'Smith', date_of_birth: '1995-10-22', passenger_type: 'Student' }
  ]);
  setStorageItem('tickets', []);
  setStorageItem('routes', [
    { route_id: 'R001', route_name: 'Downtown Express', start_point: 'Central Station', end_point: 'Business Park' }
  ]);
  setStorageItem('buses', [
    { bus_id: 'B001', route_id: 'R001', capacity: 40, status: 'Active' }
  ]);
  setStorageItem('passes', []);
}

export const authService = {
  login: async (username, password) => {
    await delay(800);
    if (username === 'admin' && password === 'admin') {
      const user = { username: 'admin', role: 'admin', token: 'mock-jwt-token' };
      localStorage.setItem('user', JSON.stringify(user));
      return { data: user };
    }
    throw new Error('Invalid credentials');
  },
  logout: () => {
    localStorage.removeItem('user');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },
  getUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

export const dashboardService = {
  getStats: async () => {
    await delay(500);
    const passengers = getStorageItem('passengers', []);
    const tickets = getStorageItem('tickets', []);
    const routes = getStorageItem('routes', []);
    const passes = getStorageItem('passes', []);
    
    return {
      data: {
        totalPassengers: passengers.length,
        totalTickets: tickets.length,
        totalRoutes: routes.length,
        totalPasses: passes.length,
      }
    };
  }
};

export const passengerService = {
  getAll: async () => {
    await delay(500);
    return { data: getStorageItem('passengers', []) };
  },
  add: async (passenger) => {
    await delay(500);
    const passengers = getStorageItem('passengers', []);
    const newPassenger = { ...passenger, passenger_id: `P${String(passengers.length + 1).padStart(3, '0')}` };
    passengers.push(newPassenger);
    setStorageItem('passengers', passengers);
    return { data: newPassenger };
  },
  delete: async (id) => {
    await delay(500);
    let passengers = getStorageItem('passengers', []);
    passengers = passengers.filter(p => p.passenger_id !== id);
    setStorageItem('passengers', passengers);
    return { data: { success: true } };
  }
};

export const ticketService = {
  getAll: async () => {
    await delay(500);
    return { data: getStorageItem('tickets', []) };
  },
  book: async (ticket) => {
    await delay(500);
    const tickets = getStorageItem('tickets', []);
    const newTicket = { ...ticket, ticket_id: `T${String(Date.now()).slice(-6)}` };
    tickets.push(newTicket);
    setStorageItem('tickets', tickets);
    return { data: newTicket };
  }
};

export const routeService = {
  getAll: async () => {
    await delay(500);
    return { data: getStorageItem('routes', []) };
  },
  add: async (route) => {
    await delay(500);
    const routes = getStorageItem('routes', []);
    const newRoute = { ...route, route_id: `R${String(routes.length + 1).padStart(3, '0')}` };
    routes.push(newRoute);
    setStorageItem('routes', routes);
    return { data: newRoute };
  }
};

export const busService = {
  getAll: async () => {
    await delay(500);
    return { data: getStorageItem('buses', []) };
  }
};

export const passService = {
  getAll: async () => {
    await delay(500);
    return { data: getStorageItem('passes', []) };
  },
  issue: async (pass) => {
    await delay(500);
    const passes = getStorageItem('passes', []);
    const newPass = { ...pass, pass_id: `BP${String(Date.now()).slice(-6)}` };
    passes.push(newPass);
    setStorageItem('passes', passes);
    return { data: newPass };
  }
};
