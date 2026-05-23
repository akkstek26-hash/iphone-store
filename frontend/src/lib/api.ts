import { products as staticProducts, Product } from './data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const USE_STATIC = !API_URL || API_URL === '';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

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

const PROMO_CODES: Record<string, number> = {
  APPLE10: 10, WELCOME15: 15, IPHONE20: 20, VIP25: 25,
};

const DEMO_USERS = {
  admin: { _id: 'admin-1', name: 'Admin', email: 'admin@iphonestore.com', role: 'admin', phone: '', favorites: [] },
  user: { _id: 'user-1', name: 'Demo User', email: 'user@example.com', role: 'user', phone: '', favorites: [] },
};

function getStaticOrders(): any[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('iphone-store-orders') || '[]');
}
function saveStaticOrders(orders: any[]) {
  if (typeof window !== 'undefined') localStorage.setItem('iphone-store-orders', JSON.stringify(orders));
}

function staticGetProducts(params: string) {
  const sp = new URLSearchParams(params);
  let filtered: Product[] = [...staticProducts];

  const search = sp.get('search');
  const category = sp.get('category');
  const year = sp.get('year');
  const featured = sp.get('featured');
  const isNew = sp.get('isNew');
  const sort = sp.get('sort') || 'newest';
  const page = parseInt(sp.get('page') || '1');
  const limit = parseInt(sp.get('limit') || '12');

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (category) filtered = filtered.filter(p => p.category === category);
  if (year) filtered = filtered.filter(p => p.year === Number(year));
  if (featured === 'true') filtered = filtered.filter(p => p.featured);
  if (isNew === 'true') filtered = filtered.filter(p => p.isNewProduct);

  switch (sort) {
    case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
    case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
    case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
    case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'newest': default: filtered.sort((a, b) => b.year - a.year); break;
  }

  const total = filtered.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const products = filtered.slice(start, start + limit);

  return { products, total, pages, page };
}

export const api = {
  login: async (email: string, password: string) => {
    if (USE_STATIC) {
      if (email === 'admin@iphonestore.com' && password === 'admin123')
        return { user: DEMO_USERS.admin, token: 'demo-admin-token' };
      if (email === 'user@example.com' && password === 'user123')
        return { user: DEMO_USERS.user, token: 'demo-user-token' };
      throw new Error('Неверный email или пароль');
    }
    return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },

  register: async (name: string, email: string, password: string) => {
    if (USE_STATIC) {
      const user = { _id: 'u-' + Date.now(), name, email, role: 'user', phone: '', favorites: [] };
      return { user, token: 'demo-token-' + Date.now() };
    }
    return request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  },

  getMe: async () => {
    if (USE_STATIC) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token === 'demo-admin-token') return DEMO_USERS.admin;
      return DEMO_USERS.user;
    }
    return request('/auth/me');
  },

  updateProfile: async (data: Record<string, unknown>) => {
    if (USE_STATIC) return { ...DEMO_USERS.user, ...data };
    return request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
  },

  toggleFavorite: async (productId: string) => {
    if (USE_STATIC) return { message: 'ok' };
    return request(`/auth/favorites/${productId}`, { method: 'POST' });
  },

  getProducts: async (params: string = '') => {
    if (USE_STATIC) return staticGetProducts(params);
    return request(`/products?${params}`);
  },

  getProduct: async (slug: string) => {
    if (USE_STATIC) {
      const product = staticProducts.find(p => p.slug === slug || slugify(p.name) === slug);
      if (!product) throw new Error('Товар не найден');
      return product;
    }
    return request(`/products/${slug}`);
  },

  addReview: async (id: string, data: { rating: number; comment: string }) => {
    if (USE_STATIC) return { message: 'Отзыв добавлен' };
    return request(`/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(data) });
  },

  getFilters: async () => {
    if (USE_STATIC) return { categories: ['classic', 'modern', 'premium', 'se'], years: [...new Set(staticProducts.map(p => p.year))].sort((a, b) => b - a) };
    return request('/products/meta/filters');
  },

  createOrder: async (data: Record<string, unknown>) => {
    if (USE_STATIC) {
      const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      const order = { _id: 'o-' + Date.now(), orderNumber, ...data, status: 'new', createdAt: new Date().toISOString(), totalPrice: 0 };
      const orders = getStaticOrders();
      orders.unshift(order);
      saveStaticOrders(orders);
      return order;
    }
    return request('/orders', { method: 'POST', body: JSON.stringify(data) });
  },

  getMyOrders: async () => {
    if (USE_STATIC) return getStaticOrders();
    return request('/orders/my');
  },

  getOrder: async (id: string) => {
    if (USE_STATIC) return getStaticOrders().find((o: any) => o._id === id) || {};
    return request(`/orders/${id}`);
  },

  validatePromo: async (code: string) => {
    if (USE_STATIC) {
      const discount = PROMO_CODES[code.toUpperCase()];
      if (discount) return { valid: true, discount };
      return { valid: false };
    }
    return request('/orders/promo', { method: 'POST', body: JSON.stringify({ code }) });
  },

  getAdminOrders: async (params: string = '') => {
    if (USE_STATIC) return { orders: getStaticOrders() };
    return request(`/orders?${params}`);
  },

  updateOrderStatus: async (id: string, status: string, comment?: string) => {
    if (USE_STATIC) {
      const orders = getStaticOrders();
      const order = orders.find((o: any) => o._id === id);
      if (order) { order.status = status; saveStaticOrders(orders); }
      return { message: 'ok' };
    }
    return request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, comment }) });
  },

  getAdminStats: async () => {
    if (USE_STATIC) return { topProducts: [], monthlyRevenue: [] };
    return request('/orders/admin/stats');
  },

  getDashboard: async () => {
    if (USE_STATIC) {
      return {
        totalProducts: staticProducts.length,
        totalUsers: 156,
        totalOrders: getStaticOrders().length + 47,
        totalRevenue: 2845000,
        recentOrders: getStaticOrders().slice(0, 5),
      };
    }
    return request('/admin/dashboard');
  },

  getAdminUsers: async (params: string = '') => {
    if (USE_STATIC) return { users: [DEMO_USERS.admin, DEMO_USERS.user] };
    return request(`/admin/users?${params}`);
  },

  createProduct: async (data: Record<string, unknown>) => {
    if (USE_STATIC) return { message: 'ok', ...data };
    return request('/products', { method: 'POST', body: JSON.stringify(data) });
  },

  updateProduct: async (id: string, data: Record<string, unknown>) => {
    if (USE_STATIC) return { message: 'ok' };
    return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  deleteProduct: async (id: string) => {
    if (USE_STATIC) return { message: 'ok' };
    return request(`/products/${id}`, { method: 'DELETE' });
  },
};
