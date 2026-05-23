export default function ContactsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Контакты</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {[
          { icon: '📞', title: 'Телефон', info: '+7 (800) 555-35-35', desc: 'Бесплатный звонок по России' },
          { icon: '✉️', title: 'Email', info: 'support@iphonestore.ru', desc: 'Ответим в течение часа' },
          { icon: '📍', title: 'Адрес', info: 'Москва, ул. Apple, д. 1', desc: 'Пн-Вс 10:00 — 22:00' },
          { icon: '💬', title: 'Telegram', info: '@iphonestore_support', desc: 'Онлайн-поддержка 24/7' },
        ].map(c => (
          <div key={c.title} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6">
            <div className="text-3xl mb-3">{c.icon}</div>
            <h3 className="font-semibold mb-1">{c.title}</h3>
            <p className="font-medium text-blue-500">{c.info}</p>
            <p className="text-sm text-neutral-500 mt-1">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
