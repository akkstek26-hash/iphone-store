'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = isLogin
        ? await api.login(form.email, form.password)
        : await api.register(form.name, form.email, form.password);
      setAuth(data.user, data.token);
      router.push(data.user.role === 'admin' ? '/admin' : '/profile');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{isLogin ? 'Вход' : 'Регистрация'}</h1>
          <p className="text-neutral-500">{isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6 sm:p-8 space-y-4">
          {!isLogin && (
            <div>
              <label className="text-sm text-neutral-500 mb-1 block">Имя</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Иван Петров"/>
            </div>
          )}
          <div>
            <label className="text-sm text-neutral-500 mb-1 block">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@example.com"/>
          </div>
          <div>
            <label className="text-sm text-neutral-500 mb-1 block">Пароль</label>
            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Минимум 6 символов"/>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-300 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-blue-500/25">
            {loading ? '...' : isLogin ? 'Войти' : 'Создать аккаунт'}
          </button>

          <p className="text-center text-sm text-neutral-500">
            {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-500 hover:text-blue-600 font-medium">
              {isLogin ? 'Регистрация' : 'Войти'}
            </button>
          </p>

          <div className="text-xs text-neutral-400 text-center border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <p>Демо-аккаунты:</p>
            <p>Админ: admin@iphonestore.com / admin123</p>
            <p>Пользователь: user@example.com / user123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
