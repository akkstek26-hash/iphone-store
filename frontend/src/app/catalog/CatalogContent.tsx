'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/api';

export default function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [search, setSearch] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '12');
      params.set('sort', sort);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedYear) params.set('year', selectedYear);
      if (search) params.set('search', search);

      const sp = searchParams;
      if (sp.get('featured')) params.set('featured', 'true');
      if (sp.get('isNew')) params.set('isNew', 'true');
      if (sp.get('category')) params.set('category', sp.get('category')!);
      if (sp.get('search')) params.set('search', sp.get('search')!);

      const data = await api.getProducts(params.toString());
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [page, sort, selectedCategory, selectedYear, search, searchParams]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const categories = [
    { value: '', label: 'Все' },
    { value: 'classic', label: 'Classic' },
    { value: 'modern', label: 'Modern' },
    { value: 'premium', label: 'Premium' },
    { value: 'se', label: 'SE' },
  ];

  const years = Array.from({ length: 2025 - 2007 + 1 }, (_, i) => 2025 - i);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Каталог iPhone</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none w-48"
        />
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Все годы</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="newest">Сначала новые</option>
          <option value="price_asc">Цена ↑</option>
          <option value="price_desc">Цена ↓</option>
          <option value="rating">По рейтингу</option>
          <option value="name">По названию</option>
        </select>
      </div>

      <p className="text-sm text-neutral-500 mb-6">Найдено: {total} товаров</p>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-4 animate-pulse">
              <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-xl mb-4"/>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-3/4"/>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"/>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-neutral-500">
          <p className="text-5xl mb-4">📱</p>
          <p className="text-lg font-medium">Товары не найдены</p>
          <p className="text-sm mt-1">Попробуйте изменить параметры фильтрации</p>
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition ${
                page === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
