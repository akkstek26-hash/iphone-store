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
  APPLE5: 5, SAVE10: 10, SAVE15: 15, SAVE20: 20, SAVE25: 25, SAVE30: 30,
  MEGA35: 35, MEGA40: 40, MEGA50: 50, SUPER60: 60, SUPER70: 70,
  MAX80: 80, MAX90: 90, FREE100: 100, GIFT5: 5, GIFT10: 10,
  GIFT15: 15, GIFT20: 20, GIFT25: 25, GIFT30: 30, GIFT35: 35,
  SPRING10: 10, SPRING20: 20, SPRING30: 30, SPRING50: 50,
  SUMMER10: 10, SUMMER20: 20, SUMMER30: 30, SUMMER50: 50,
  AUTUMN10: 10, AUTUMN20: 20, AUTUMN30: 30, AUTUMN50: 50,
  WINTER10: 10, WINTER20: 20, WINTER30: 30, WINTER50: 50,
  NEWYEAR: 30, CHRISTMAS: 25, BLACKFRIDAY: 50, CYBERMONDAY: 45,
  SALE10: 10, SALE20: 20, SALE30: 30, SALE40: 40, SALE50: 50,
  FLASH15: 15, FLASH25: 25, FLASH35: 35, FLASH45: 45, FLASH55: 55,
  HOT10: 10, HOT20: 20, HOT30: 30, HOT40: 40, HOT50: 50,
  DEAL5: 5, DEAL10: 10, DEAL15: 15, DEAL20: 20, DEAL25: 25,
  LUCKY7: 7, LUCKY13: 13, LUCKY21: 21, LUCKY33: 33, LUCKY77: 77,
  PRO10: 10, PRO20: 20, PRO30: 30, PRO50: 50, PRO100: 100,
  FIRST10: 10, FIRST20: 20, FIRST30: 30, FIRST50: 50,
  STUDENT15: 15, STUDENT25: 25, STUDENT30: 30,
  FRIEND10: 10, FRIEND20: 20, FRIEND30: 30,
  BIRTHDAY: 30, HOLIDAY: 25, WEEKEND: 15,
  SECRET50: 50, SECRET75: 75, SECRET100: 100,
  BONUS5: 5, BONUS10: 10, BONUS15: 15, BONUS20: 20, BONUS25: 25,
  PROMO5: 5, PROMO10: 10, PROMO15: 15, PROMO20: 20, PROMO25: 25,
  DISCOUNT5: 5, DISCOUNT10: 10, DISCOUNT15: 15, DISCOUNT20: 20,
  PERCENT10: 10, PERCENT25: 25, PERCENT50: 50, PERCENT75: 75, PERCENT100: 100,
};

function getStaticUsers(): any[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('iphone-store-users') || '[]');
}
function saveStaticUsers(users: any[]) {
  if (typeof window !== 'undefined') localStorage.setItem('iphone-store-users', JSON.stringify(users));
}

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
        return { user: { _id: 'admin-1', name: 'Администратор', email, role: 'admin', phone: '', favorites: [] }, token: 'demo-admin-token' };
      const users = getStaticUsers();
      const found = users.find((u: any) => u.email === email && u.password === password);
      if (found) return { user: { ...found, password: undefined }, token: 'user-token-' + found._id };
      throw new Error('Неверный email или пароль');
    }
    return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },

  register: async (name: string, email: string, password: string) => {
    if (USE_STATIC) {
      const users = getStaticUsers();
      if (users.find((u: any) => u.email === email)) throw new Error('Пользователь с таким email уже существует');
      const user = { _id: 'u-' + Date.now(), name, email, password, role: 'user', phone: '', favorites: [] };
      users.push(user);
      saveStaticUsers(users);
      return { user: { ...user, password: undefined }, token: 'user-token-' + user._id };
    }
    return request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  },

  getMe: async () => {
    if (USE_STATIC) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token === 'demo-admin-token') return { _id: 'admin-1', name: 'Администратор', email: 'admin@iphonestore.com', role: 'admin', phone: '', favorites: [] };
      if (token) {
        const uid = token.replace('user-token-', '');
        const users = getStaticUsers();
        const u = users.find((x: any) => x._id === uid);
        if (u) return { ...u, password: undefined };
      }
      return { _id: 'guest', name: 'Гость', email: '', role: 'user', phone: '', favorites: [] };
    }
    return request('/auth/me');
  },

  updateProfile: async (data: Record<string, unknown>) => {
    if (USE_STATIC) return { ...data };
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
      const order = { _id: 'o-' + Date.now(), orderNumber, ...data, status: 'new', createdAt: new Date().toISOString() };
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
        totalUsers: getStaticUsers().length + 1,
        totalOrders: getStaticOrders().length,
        totalRevenue: getStaticOrders().reduce((s: number, o: any) => s + (o.totalPrice || 0), 0),
        recentOrders: getStaticOrders().slice(0, 5),
      };
    }
    return request('/admin/dashboard');
  },

  getAdminUsers: async (params: string = '') => {
    if (USE_STATIC) {
      const users = getStaticUsers().map((u: any) => ({ ...u, password: undefined }));
      return { users: [{ _id: 'admin-1', name: 'Администратор', email: 'admin@iphonestore.com', role: 'admin' }, ...users] };
    }
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
