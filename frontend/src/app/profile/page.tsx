'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const { user, logout } = useStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [tab, setTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    api.getMyOrders().then(setOrders).catch(() => {});
    api.getMe().then(setProfile).catch(() => {});
  }, [user, router]);

  if (!user) return null;

  const statusLabels: Record<string, string> = {
    new: 'Новый', confirmed: 'Подтверждён', processing: 'В обработке',
    packing: 'Упаковывается', shipped: 'Отправлен', in_transit: 'В пути',
    delivering: 'Доставляется', delivered: 'Доставлен',
    completed: 'Завершён', cancelled: 'Отменён',
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700', confirmed: 'bg-cyan-100 text-cyan-700',
    processing: 'bg-yellow-100 text-yellow-700', packing: 'bg-orange-100 text-orange-700',
    shipped: 'bg-purple-100 text-purple-700', in_transit: 'bg-indigo-100 text-indigo-700',
    delivering: 'bg-violet-100 text-violet-700', delivered: 'bg-green-100 text-green-700',
    completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Личный кабинет</h1>
        <div className="flex items-center gap-4">
          {user.role === 'admin' && <Link href="/admin" className="text-sm text-blue-500 hover:text-blue-600">Админ-панель</Link>}
          <button onClick={() => { logout(); router.push('/'); }} className="text-sm text-red-500 hover:text-red-600">Выйти</button>
        </div>
      </div>

      {/* User info */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {user.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <p className="font-semibold text-lg">{user.name}</p>
          <p className="text-sm text-neutral-500">{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'orders' ? 'bg-blue-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
          Мои заказы ({orders.length})
        </button>
        <button onClick={() => setTab('profile')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'profile' ? 'bg-blue-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
          Профиль
        </button>
      </div>

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <p className="text-4xl mb-3">📦</p>
              <p>У вас пока нет заказов</p>
              <Link href="/catalog" className="text-blue-500 hover:text-blue-600 text-sm mt-2 inline-block">Перейти в каталог</Link>
            </div>
          ) : orders.map((order: any) => (
            <div key={order._id} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <span className="font-mono font-bold text-sm">{order.orderNumber}</span>
                  <span className="text-xs text-neutral-500 ml-3">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || 'bg-neutral-100'}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-lg">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-xs text-neutral-500">×{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Итого</span>
                <span className="font-bold">{order.totalPrice?.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'profile' && (
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6">
          <p className="text-sm text-neutral-500">Имя: <span className="text-neutral-900 dark:text-white">{profile?.name}</span></p>
          <p className="text-sm text-neutral-500 mt-2">Email: <span className="text-neutral-900 dark:text-white">{profile?.email}</span></p>
          <p className="text-sm text-neutral-500 mt-2">Телефон: <span className="text-neutral-900 dark:text-white">{profile?.phone || '—'}</span></p>
        </div>
      )}
    </div>
  );
}
