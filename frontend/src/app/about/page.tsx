export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">О нас</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">iPhone Store</h2>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Мы — ведущий интернет-магазин Apple iPhone в России. В нашем каталоге представлены все модели iPhone, 
            начиная с самого первого iPhone 2G 2007 года и заканчивая новейшим iPhone 17 Pro Max 2025 года.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { num: '48+', label: 'Моделей iPhone' },
            { num: '10K+', label: 'Довольных клиентов' },
            { num: '24/7', label: 'Поддержка' },
          ].map(s => (
            <div key={s.label} className="text-center p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
              <div className="text-3xl font-bold text-blue-500 mb-1">{s.num}</div>
              <div className="text-sm text-neutral-500">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-4">Почему мы?</h3>
          <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
            <li>✅ Официальная гарантия Apple на все устройства</li>
            <li>✅ Бесплатная доставка при заказе от 30 000 ₽</li>
            <li>✅ Возврат в течение 14 дней</li>
            <li>✅ Профессиональная консультация</li>
            <li>✅ Безопасная оплата</li>
          </ul>
        </div>
        <p className="text-xs text-neutral-400 text-center">Демо-проект. Не является реальным интернет-магазином.</p>
      </div>
    </div>
  );
}
