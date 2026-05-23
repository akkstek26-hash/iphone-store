'use client';
import { useState } from 'react';

const faqs = [
  { q: 'Как оформить заказ?', a: 'Выберите товар, добавьте в корзину, перейдите к оформлению и заполните контактные данные. Мы свяжемся с вами для подтверждения.' },
  { q: 'Какие способы оплаты доступны?', a: 'Банковская карта (Visa, MasterCard, МИР), PayPal, наличные при получении.' },
  { q: 'Как узнать статус заказа?', a: 'В личном кабинете в разделе "Мои заказы" отображается текущий статус каждого заказа.' },
  { q: 'Какие гарантии на товар?', a: 'На все устройства действует официальная гарантия Apple сроком 1 год.' },
  { q: 'Можно ли вернуть товар?', a: 'Да, в течение 14 дней с момента получения в соответствии с законодательством РФ.' },
  { q: 'Как работает доставка?', a: 'Курьерская доставка (1-2 дня, 500 ₽), Почта России (5-7 дней, 300 ₽), самовывоз (бесплатно).' },
  { q: 'Есть ли программа Trade-In?', a: 'Да, вы можете сдать свой старый iPhone и получить скидку на новый.' },
  { q: 'Как использовать промокод?', a: 'При оформлении заказа введите промокод в соответствующее поле и нажмите "Применить".' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Часто задаваемые вопросы</h1>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="font-medium pr-4">{faq.q}</span>
              <svg className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-neutral-600 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-700 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
