import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if the error is 401 AND it's NOT the login request itself
    if (error.response && error.response.status === 401 && !error.config.url.endsWith('/auth/login')) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },
  register: async (username, password, role = 'user') => {
    const response = await api.post('/auth/register', { username, password, role });
    return response.data;
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
    const response = await api.get('/dashboard');
    return response.data;
  }
};

export const passengerService = {
  getAll: async () => {
    const response = await api.get('/passengers');
    return response.data;
  },
  add: async (passenger) => {
    const response = await api.post('/passengers', passenger);
    return response.data;
  },
  update: async (id, passenger) => {
    const response = await api.put(`/passengers/${id}`, passenger);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/passengers/${id}`);
    return response.data;
  }
};

export const ticketService = {
  getAll: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },
  book: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  }
};

export const routeService = {
  getAll: async () => {
    const response = await api.get('/routes');
    return response.data;
  },
  add: async (route) => {
    const response = await api.post('/routes', route);
    return response.data;
  }
};

export const busService = {
  getAll: async () => {
    const response = await api.get('/bus');
    return response.data;
  },
  add: async (bus) => {
    const response = await api.post('/bus', bus);
    return response.data;
  }
};

export const seatService = {
  getByBusId: async (busId) => {
    const response = await api.get(`/seats/${busId}`);
    return response.data;
  },
  book: async (busId, seatNumber) => {
    const response = await api.put('/seats/book', { bus_id: busId, seat_number: seatNumber });
    return response.data;
  }
};

export const passService = {
  getAll: async () => {
    const response = await api.get('/pass');
    return response.data;
  },
  issue: async (passData) => {
    const response = await api.post('/pass', passData);
    return response.data;
  }
};
