'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/api';

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [f, n] = await Promise.all([
          api.getProducts('featured=true&limit=4'),
          api.getProducts('isNew=true&limit=8&sort=newest'),
        ]);
        setFeatured(f.products || []);
        setNewProducts(n.products || []);
      } catch {
        // API not available, use empty
      }
      setLoading(false);
    }
    load();
  }, []);

  const categories = [
    { name: 'iPhone 17', slug: 'catalog?search=iphone+17', emoji: '🆕', desc: 'Новейшие модели 2025' },
    { name: 'iPhone 16', slug: 'catalog?search=iphone+16', emoji: '⭐', desc: 'Флагманы 2024' },
    { name: 'iPhone Pro', slug: 'catalog?category=premium', emoji: '💎', desc: 'Линейка Pro и Pro Max' },
    { name: 'iPhone SE', slug: 'catalog?category=se', emoji: '💰', desc: 'Доступные модели' },
    { name: 'Classic', slug: 'catalog?category=classic', emoji: '📱', desc: 'iPhone 2G — 5S' },
    { name: 'Все iPhone', slug: 'catalog', emoji: '🍎', desc: 'Полный каталог' },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-full">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"/>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Новинка 2025</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                iPhone 17
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Pro Max</span>
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md">
                Титан. A19 Pro. Тройная 48 МП камера. Самый мощный iPhone в истории.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/product/iphone-17-pro-max" className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition-all hover:shadow-xl hover:shadow-blue-500/25">
                  Купить — от 89 990 ₽
                </Link>
                <Link href="/catalog?search=iphone+17" className="px-8 py-3.5 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-medium rounded-full border border-neutral-200 dark:border-neutral-700 transition">
                  Все модели →
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"/>
                <div className="relative w-full h-full flex items-center justify-center text-[200px] sm:text-[280px] select-none">
                  📱
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">Категории</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/${cat.slug}`} className="group p-5 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl text-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <div className="font-semibold text-sm mb-1">{cat.name}</div>
              <div className="text-xs text-neutral-500">{cat.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Популярные</h2>
            <Link href="/catalog?featured=true" className="text-sm text-blue-500 hover:text-blue-600 transition">Все →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Новинки</h2>
            <Link href="/catalog?isNew=true" className="text-sm text-blue-500 hover:text-blue-600 transition">Все →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newProducts.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-700 rounded-3xl p-8 sm:p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"/>
          <div className="relative z-10">
            <p className="text-blue-400 font-medium text-sm mb-2">Промокод</p>
            <h3 className="text-3xl sm:text-4xl font-bold mb-3">WELCOME15</h3>
            <p className="text-neutral-300 mb-6 max-w-md">Скидка 15% на первый заказ. Введите промокод при оформлении.</p>
            <Link href="/catalog" className="inline-flex px-6 py-3 bg-white text-neutral-900 font-medium rounded-full hover:bg-neutral-100 transition">
              Перейти в каталог
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Бесплатная доставка', desc: 'При заказе от 30 000 ₽' },
            { icon: '🔒', title: 'Гарантия', desc: 'Официальная гарантия Apple' },
            { icon: '💳', title: 'Оплата', desc: 'Картой, наличными, рассрочка' },
            { icon: '🔄', title: 'Возврат', desc: '14 дней на возврат товара' },
          ].map((f) => (
            <div key={f.title} className="text-center p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold mb-1">{f.title}</div>
              <div className="text-sm text-neutral-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Loading skeleton */}
      {loading && featured.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold mb-8">Популярные</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-xl mb-4"/>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-3/4"/>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"/>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
