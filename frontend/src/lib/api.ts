const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Ошибка запроса');
  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data: Record<string, unknown>) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  toggleFavorite: (productId: string) => request(`/auth/favorites/${productId}`, { method: 'POST' }),

  // Products
  getProducts: (params: string = '') => request(`/products?${params}`),
  getProduct: (slug: string) => request(`/products/${slug}`),
  addReview: (id: string, data: { rating: number; comment: string }) => request(`/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  getFilters: () => request('/products/meta/filters'),

  // Orders
  createOrder: (data: Record<string, unknown>) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getMyOrders: () => request('/orders/my'),
  getOrder: (id: string) => request(`/orders/${id}`),
  validatePromo: (code: string) => request('/orders/promo', { method: 'POST', body: JSON.stringify({ code }) }),

  // Admin
  getAdminOrders: (params: string = '') => request(`/orders?${params}`),
  updateOrderStatus: (id: string, status: string, comment?: string) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, comment }) }),
  getAdminStats: () => request('/orders/admin/stats'),
  getDashboard: () => request('/admin/dashboard'),
  getAdminUsers: (params: string = '') => request(`/admin/users?${params}`),
  createProduct: (data: Record<string, unknown>) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Record<string, unknown>) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),
};
