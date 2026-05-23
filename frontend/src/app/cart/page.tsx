'use client';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold mb-2">Корзина пуста</h1>
        <p className="text-neutral-500 mb-6">Добавьте товары из каталога</p>
        <Link href="/catalog" className="inline-flex px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Корзина ({cart.length})</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 transition">Очистить</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={`${item.id}-${item.color}-${item.storage}`} className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
              <div className="w-24 h-24 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain"/>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                <p className="text-sm text-neutral-500 mt-0.5">{item.color} · {item.storage}</p>
                <p className="font-bold mt-1">{item.price.toLocaleString('ru-RU')} ₽</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.color, item.storage, item.quantity - 1)} className="px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition rounded-l-lg">−</button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.color, item.storage, item.quantity + 1)} className="px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition rounded-r-lg">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.color, item.storage)} className="text-sm text-red-500 hover:text-red-600 transition">Удалить</button>
                </div>
              </div>
              <div className="text-right font-bold whitespace-nowrap">
                {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-lg">Итого</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Товаров</span>
                <span>{cart.reduce((s, i) => s + i.quantity, 0)} шт.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Сумма</span>
                <span>{cartTotal().toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Итого</span>
                <span>{cartTotal().toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
            <Link href="/checkout" className="block w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-center transition-all hover:shadow-xl hover:shadow-blue-500/25">
              Оформить заказ
            </Link>
            <Link href="/catalog" className="block text-center text-sm text-blue-500 hover:text-blue-600 transition">
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
