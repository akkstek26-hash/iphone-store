'use client';
import { Suspense } from 'react';
import CatalogContent from './CatalogContent';

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Каталог iPhone</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-4 animate-pulse">
              <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-xl mb-4"/>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-3/4"/>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"/>
            </div>
          ))}
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
