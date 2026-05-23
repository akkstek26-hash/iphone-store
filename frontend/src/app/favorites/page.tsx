'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function FavoritesPage() {
  const { favorites } = useStore();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (favorites.length === 0) return;
    api.getProducts(`limit=100`).then(data => {
      setProducts((data.products || []).filter((p: any) => favorites.includes(p._id)));
    }).catch(() => {});
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Избранное ({favorites.length})</h1>
      {favorites.length === 0 ? (
        <div className="text-center py-20 text-neutral-500">
          <p className="text-5xl mb-4">❤️</p>
          <p className="text-lg font-medium">Пока пусто</p>
          <p className="text-sm mt-1 mb-4">Добавляйте понравившиеся товары</p>
          <Link href="/catalog" className="text-blue-500 hover:text-blue-600">Перейти в каталог</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
