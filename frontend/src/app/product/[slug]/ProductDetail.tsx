'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/store/useStore';

export default function ProductDetail({ slug }: { slug: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const { addToCart, favorites, toggleFavorite } = useStore();

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getProduct(slug);
        setProduct(data);
      } catch { /* */ }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-3xl animate-pulse"/>
        <div className="space-y-4">
          <div className="h-8 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-3/4 animate-pulse"/>
          <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-1/2 animate-pulse"/>
          <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-full animate-pulse"/>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">😔</p>
      <p className="text-lg font-medium">Товар не найден</p>
    </div>
  );

  const currentPrice = product.price + (product.storage[selectedStorage]?.priceAdd || 0);
  const isFav = favorites.includes(product._id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: currentPrice,
      color: product.colors[selectedColor]?.name || '',
      storage: product.storage[selectedStorage]?.size || '',
      quantity: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl flex items-center justify-center overflow-hidden">
            <div className="text-8xl">📱</div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex gap-2">
            {(product.isNew || product.isNewProduct) && <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">Новинка</span>}
            {discount > 0 && <span className="px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">-{discount}%</span>}
            {product.inStock ? <span className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">В наличии</span> : <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">Нет в наличии</span>}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-neutral-300'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-sm text-neutral-500">{product.rating?.toFixed(1)} ({product.numReviews} отзывов)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{currentPrice.toLocaleString('ru-RU')} ₽</span>
            {product.oldPrice && <span className="text-xl text-neutral-400 line-through">{product.oldPrice.toLocaleString('ru-RU')} ₽</span>}
          </div>

          <p className="text-neutral-600 dark:text-neutral-400">{product.description}</p>

          {/* Colors */}
          <div>
            <p className="text-sm font-medium mb-3">Цвет: <span className="text-neutral-500">{product.colors[selectedColor]?.name}</span></p>
            <div className="flex gap-2">
              {product.colors.map((c: any, i: number) => (
                <button key={c.hex} onClick={() => setSelectedColor(i)} className={`w-8 h-8 rounded-full border-2 transition ${i === selectedColor ? 'border-blue-500 scale-110' : 'border-neutral-200 dark:border-neutral-700'}`} style={{ backgroundColor: c.hex }} title={c.name}/>
              ))}
            </div>
          </div>

          {/* Storage */}
          <div>
            <p className="text-sm font-medium mb-3">Память:</p>
            <div className="flex flex-wrap gap-2">
              {product.storage.map((s: any, i: number) => (
                <button key={s.size} onClick={() => setSelectedStorage(i)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${i === selectedStorage ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'}`}>
                  {s.size}{s.priceAdd > 0 && ` (+${s.priceAdd.toLocaleString('ru-RU')} ₽)`}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-500/25">
              Добавить в корзину
            </button>
            <button onClick={() => toggleFavorite(product._id)} className={`px-5 py-4 rounded-2xl border transition ${isFav ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-800' : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'}`}>
              <svg className={`w-6 h-6 ${isFav ? 'text-red-500 fill-red-500' : 'text-neutral-400'}`} viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
              </svg>
            </button>
          </div>

          {/* Specs */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <h3 className="font-semibold mb-4">Характеристики</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(product.specs || {}).map(([key, val]) => (
                <div key={key} className="flex justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <span className="text-sm text-neutral-500 capitalize">{key === 'display' ? 'Дисплей' : key === 'chip' ? 'Процессор' : key === 'camera' ? 'Камера' : key === 'battery' ? 'Батарея' : key === 'weight' ? 'Вес' : key === 'os' ? 'ОС' : key === 'water' ? 'Защита' : key === 'connectivity' ? 'Связь' : key}</span>
                  <span className="text-sm font-medium text-right ml-2">{val as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
