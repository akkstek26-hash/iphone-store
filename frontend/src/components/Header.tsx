'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = useStore((s) => s.cartCount());
  const user = useStore((s) => s.user);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-6 h-6 text-neutral-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.99 2.97 12.5 4.7 9.48C5.55 7.98 7.13 7.04 8.82 7.02C10.1 7 11.29 7.88 12.06 7.88C12.83 7.88 14.25 6.81 15.82 7C16.47 7.03 18.25 7.26 19.4 8.93C19.29 9 16.63 10.52 16.66 13.7C16.7 17.48 19.9 18.67 19.94 18.69C19.9 18.78 19.4 20.46 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
            </svg>
            <span className="font-semibold text-lg text-neutral-900 dark:text-white hidden sm:block">Store</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-600 dark:text-neutral-300">
            <Link href="/catalog" className="hover:text-neutral-900 dark:hover:text-white transition">Каталог</Link>
            <Link href="/catalog?isNew=true" className="hover:text-neutral-900 dark:hover:text-white transition">Новинки</Link>
            <Link href="/about" className="hover:text-neutral-900 dark:hover:text-white transition">О нас</Link>
            <Link href="/contacts" className="hover:text-neutral-900 dark:hover:text-white transition">Контакты</Link>
            <Link href="/faq" className="hover:text-neutral-900 dark:hover:text-white transition">FAQ</Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" aria-label="Поиск">
              <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            </button>

            {/* Dark mode */}
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" aria-label="Тема">
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              ) : (
                <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>
              )}
            </button>

            {/* Favorites */}
            <Link href="/favorites" className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" aria-label="Избранное">
              <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition relative" aria-label="Корзина">
              <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">{cartCount}</span>
              )}
            </Link>

            {/* Profile */}
            <Link href={user ? '/profile' : '/auth'} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" aria-label="Профиль">
              <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
            </Link>

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition md:hidden" aria-label="Меню">
              <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3 animate-in slide-in-from-top">
            <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/catalog?search=${searchQuery}`; }}>
              <input
                type="text"
                placeholder="Поиск iPhone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-in slide-in-from-top">
            {[
              { href: '/catalog', label: 'Каталог' },
              { href: '/catalog?isNew=true', label: 'Новинки' },
              { href: '/about', label: 'О нас' },
              { href: '/contacts', label: 'Контакты' },
              { href: '/faq', label: 'FAQ' },
            ].map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">{link.label}</Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
