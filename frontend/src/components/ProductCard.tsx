'use client';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  images: string[];
  rating: number;
  numReviews: number;
  isNew?: boolean;
  isNewProduct?: boolean;
  colors: { name: string; hex: string }[];
  storage: { size: string; priceAdd: number }[];
  inStock: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, favorites, toggleFavorite } = useStore();
  const isFav = favorites.includes(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      color: product.colors[0]?.name || '',
      storage: product.storage[0]?.size || '',
      quantity: 1,
    });
  };

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(product._id);
  };

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:-translate-y-1">
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          {(product.isNew || product.isNewProduct) && (
            <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">New</span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">-{discount}%</span>
          )}
        </div>

        {/* Favorite button */}
        <button onClick={handleFav} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm z-10 transition hover:scale-110" aria-label="Избранное">
          <svg className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : 'text-neutral-400'}`} viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
          </svg>
        </button>

        {/* Image */}
        <div className="aspect-square flex items-center justify-center mb-4 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-3/4 h-3/4 object-contain transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Colors */}
        <div className="flex gap-1 mb-2">
          {product.colors.slice(0, 5).map((c) => (
            <div key={c.hex} className="w-3 h-3 rounded-full border border-neutral-200 dark:border-neutral-600" style={{ backgroundColor: c.hex }} title={c.name}/>
          ))}
          {product.colors.length > 5 && <span className="text-[10px] text-neutral-400 ml-1">+{product.colors.length - 5}</span>}
        </div>

        {/* Name */}
        <h3 className="font-medium text-sm text-neutral-900 dark:text-white mb-1 line-clamp-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={`w-3 h-3 ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-neutral-300 dark:text-neutral-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-neutral-400">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-lg text-neutral-900 dark:text-white">{product.price.toLocaleString('ru-RU')} ₽</span>
          {product.oldPrice && (
            <span className="text-sm text-neutral-400 line-through">{product.oldPrice.toLocaleString('ru-RU')} ₽</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
        >
          В корзину
        </button>
      </div>
    </Link>
  );
}
