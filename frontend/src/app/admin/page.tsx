'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';

export default function AdminPage() {
  const { user } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<'dashboard' | 'orders' | 'products' | 'users'>('dashboard');
  const [dashboard, setDashboard] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/auth'); return; }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadData = async () => {
    try {
      const [d, s] = await Promise.all([api.getDashboard(), api.getAdminStats()]);
      setDashboard(d);
      setStats(s);
    } catch {}
  };

  const loadOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (orderSearch) params.set('search', orderSearch);
      if (orderStatus) params.set('status', orderStatus);
      const data = await api.getAdminOrders(params.toString());
      setOrders(data.orders || []);
    } catch {}
  };

  const loadProducts = async () => {
    try {
      const data = await api.getProducts('limit=100');
      setProducts(data.products || []);
    } catch {}
  };

  const loadUsers = async () => {
    try {
      const data = await api.getAdminUsers();
      setUsers(data.users || []);
    } catch {}
  };

  useEffect(() => {
    if (tab === 'orders') loadOrders();
    if (tab === 'products') loadProducts();
    if (tab === 'users') loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, orderSearch, orderStatus]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.updateOrderStatus(id, status);
      loadOrders();
    } catch {}
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Удалить товар?')) return;
    try { await api.deleteProduct(id); loadProducts(); } catch {}
  };

  const statusLabels: Record<string, string> = {
    new: 'Новый', confirmed: 'Подтверждён', processing: 'В обработке',
    packing: 'Упаковывается', shipped: 'Отправлен', in_transit: 'В пути',
    delivering: 'Доставляется', delivered: 'Доставлен',
    completed: 'Завершён', cancelled: 'Отменён',
  };

  const allStatuses = ['new', 'confirmed', 'processing', 'packing', 'shipped', 'in_transit', 'delivering', 'delivered', 'completed', 'cancelled'];

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(['dashboard', 'orders', 'products', 'users'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${tab === t ? 'bg-blue-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
            {t === 'dashboard' ? '📊 Дашборд' : t === 'orders' ? '📦 Заказы' : t === 'products' ? '📱 Товары' : '👥 Клиенты'}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Выручка', value: `${(dashboard?.totalRevenue || 0).toLocaleString('ru-RU')} ₽`, icon: '💰', color: 'from-green-500 to-emerald-500' },
              { label: 'Заказов', value: dashboard?.totalOrders || 0, icon: '📦', color: 'from-blue-500 to-cyan-500' },
              { label: 'Товаров', value: dashboard?.totalProducts || 0, icon: '📱', color: 'from-purple-500 to-violet-500' },
              { label: 'Клиентов', value: dashboard?.totalUsers || 0, icon: '👥', color: 'from-orange-500 to-amber-500' },
            ].map(card => (
              <div key={card.label} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-5 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} opacity-10 rounded-full -translate-y-1/3 translate-x-1/3`}/>
                <p className="text-3xl mb-1">{card.icon}</p>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-neutral-500">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Top products */}
          {stats?.topProducts && stats.topProducts.length > 0 && (
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">ТОП продаж</h3>
              <div className="space-y-3">
                {stats.topProducts.slice(0, 5).map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">{i + 1}</span>
                      <span className="text-sm">{p._id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{p.totalSold} шт.</span>
                      <span className="text-xs text-neutral-500 ml-2">{p.totalRevenue?.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent orders */}
          {dashboard?.recentOrders && dashboard.recentOrders.length > 0 && (
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Последние заказы</h3>
              <div className="space-y-3">
                {dashboard.recentOrders.map((o: any) => (
                  <div key={o._id} className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded-xl">
                    <div>
                      <span className="font-mono text-sm font-bold">{o.orderNumber}</span>
                      <span className="text-xs text-neutral-500 ml-2">{o.user?.name}</span>
                    </div>
                    <span className="text-sm font-medium">{o.totalPrice?.toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orders */}
      {tab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input type="text" placeholder="Поиск по номеру..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm border-0 outline-none w-48"/>
            <select value={orderStatus} onChange={e => setOrderStatus(e.target.value)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm border-0 outline-none">
              <option value="">Все статусы</option>
              {allStatuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
            </select>
          </div>
          {orders.length === 0 ? <p className="text-neutral-500 py-8 text-center">Заказов не найдено</p> : orders.map(order => (
            <div key={order._id} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <span className="font-mono font-bold">{order.orderNumber}</span>
                  <span className="text-xs text-neutral-500 ml-2">{new Date(order.createdAt).toLocaleString('ru-RU')}</span>
                  <div className="text-sm text-neutral-500 mt-1">
                    {order.user?.name} · {order.user?.email} · {order.shippingAddress?.phone}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold">{order.totalPrice?.toLocaleString('ru-RU')} ₽</span>
                  <div className="text-xs text-neutral-500">{order.paymentMethod === 'card' ? '💳 Карта' : order.paymentMethod === 'paypal' ? '🅿️ PayPal' : '💵 Наличные'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {order.items?.map((item: any, i: number) => (
                  <span key={i} className="text-xs bg-white dark:bg-neutral-800 px-2 py-1 rounded">{item.name} ×{item.quantity}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">Статус:</span>
                <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm outline-none">
                  {allStatuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products */}
      {tab === 'products' && (
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">Всего: {products.length} товаров</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 pr-4">Товар</th>
                  <th className="pb-3 pr-4">Цена</th>
                  <th className="pb-3 pr-4">Остаток</th>
                  <th className="pb-3 pr-4">Рейтинг</th>
                  <th className="pb-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-b border-neutral-100 dark:border-neutral-800">
                    <td className="py-3 pr-4 font-medium">{p.name}</td>
                    <td className="py-3 pr-4">{p.price?.toLocaleString('ru-RU')} ₽</td>
                    <td className="py-3 pr-4">{p.stockCount}</td>
                    <td className="py-3 pr-4">{p.rating?.toFixed(1)}</td>
                    <td className="py-3">
                      <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:text-red-600 text-xs">Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">Всего: {users.length} пользователей</p>
          <div className="space-y-3">
            {users.map(u => (
              <div key={u._id} className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">{u.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-neutral-500">{u.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-600'}`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
