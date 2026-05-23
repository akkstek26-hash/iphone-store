'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Магазин</h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li><Link href="/catalog" className="hover:text-neutral-900 dark:hover:text-white transition">Каталог</Link></li>
              <li><Link href="/catalog?isNew=true" className="hover:text-neutral-900 dark:hover:text-white transition">Новинки</Link></li>
              <li><Link href="/catalog?category=premium" className="hover:text-neutral-900 dark:hover:text-white transition">iPhone Pro</Link></li>
              <li><Link href="/catalog?category=se" className="hover:text-neutral-900 dark:hover:text-white transition">iPhone SE</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Покупателям</h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li><Link href="/faq" className="hover:text-neutral-900 dark:hover:text-white transition">FAQ</Link></li>
              <li><Link href="/contacts" className="hover:text-neutral-900 dark:hover:text-white transition">Контакты</Link></li>
              <li><Link href="/about" className="hover:text-neutral-900 dark:hover:text-white transition">О нас</Link></li>
              <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition">Доставка</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Аккаунт</h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li><Link href="/auth" className="hover:text-neutral-900 dark:hover:text-white transition">Войти</Link></li>
              <li><Link href="/profile" className="hover:text-neutral-900 dark:hover:text-white transition">Профиль</Link></li>
              <li><Link href="/favorites" className="hover:text-neutral-900 dark:hover:text-white transition">Избранное</Link></li>
              <li><Link href="/cart" className="hover:text-neutral-900 dark:hover:text-white transition">Корзина</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Связь</h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>📞 +7 (800) 555-35-35</li>
              <li>✉️ support@iphonestore.ru</li>
              <li>📍 Москва, ул. Apple, 1</li>
              <li>🕐 Пн-Вс 10:00 - 22:00</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} iPhone Store. Все права защищены.</p>
          <p className="mt-1 text-xs text-neutral-400">Демо-проект. Не является реальным интернет-магазином.</p>
        </div>
      </div>
    </footer>
  );
}
