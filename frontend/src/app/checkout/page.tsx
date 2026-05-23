'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, user } = useStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', street: '', city: '', zip: '', country: 'Россия' });
  const [delivery, setDelivery] = useState('courier');
  const [payment, setPayment] = useState('card');
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNum, setOrderNum] = useState('');

  const deliveryPrice = delivery === 'courier' ? 500 : delivery === 'post' ? 300 : 0;
  const subtotal = cartTotal();
  const total = subtotal + deliveryPrice - discount;

  const handlePromo = async () => {
    try {
      const data = await api.validatePromo(promo);
      if (data.valid) {
        setDiscount(Math.round(subtotal * data.discount / 100));
        setPromoMsg(`Скидка ${data.discount}% применена!`);
      } else {
        setDiscount(0);
        setPromoMsg('Промокод не найден');
      }
    } catch { setPromoMsg('Ошибка проверки промокода'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { alert('Войдите в аккаунт для оформления заказа'); return; }
    setLoading(true);
    try {
      const order = await api.createOrder({
        items: cart.map(i => ({ product: i.id, name: i.name, image: i.image, price: i.price, quantity: i.quantity, color: i.color, storage: i.storage })),
        shippingAddress: form,
        paymentMethod: payment,
        deliveryMethod: delivery,
        promoCode: promo,
      });
      setOrderNum(order.orderNumber);
      setSuccess(true);
      clearCart();
    } catch (err: any) { alert(err.message); }
    setLoading(false);
  };

  if (success) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-bold mb-2">Заказ оформлен!</h1>
      <p className="text-neutral-500 mb-2">Номер заказа: <span className="font-mono font-bold">{orderNum}</span></p>
      <p className="text-neutral-500 mb-6">Мы свяжемся с вами для подтверждения.</p>
    </div>
  );

  if (cart.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🛒</p>
      <h1 className="text-2xl font-bold">Корзина пуста</h1>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Контактные данные</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Имя', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Телефон', key: 'phone', type: 'tel' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-neutral-500 mb-1 block">{f.label}</label>
                  <input type={f.type} required value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Адрес доставки</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Улица, дом', key: 'street' },
                { label: 'Город', key: 'city' },
                { label: 'Индекс', key: 'zip' },
                { label: 'Страна', key: 'country' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-neutral-500 mb-1 block">{f.label}</label>
                  <input type="text" required value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Способ доставки</h2>
            <div className="space-y-2">
              {[
                { value: 'courier', label: 'Курьером', price: '500 ₽', desc: '1-2 дня' },
                { value: 'post', label: 'Почтой', price: '300 ₽', desc: '5-7 дней' },
                { value: 'pickup', label: 'Самовывоз', price: 'Бесплатно', desc: 'Из магазина' },
              ].map(d => (
                <label key={d.value} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${delivery === d.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-neutral-200 dark:border-neutral-700'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="delivery" value={d.value} checked={delivery === d.value} onChange={e => setDelivery(e.target.value)} className="accent-blue-500"/>
                    <div><span className="font-medium text-sm">{d.label}</span><span className="text-xs text-neutral-500 ml-2">{d.desc}</span></div>
                  </div>
                  <span className="text-sm font-medium">{d.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Способ оплаты</h2>
            <div className="space-y-2">
              {[
                { value: 'card', label: '💳 Банковская карта' },
                { value: 'paypal', label: '🅿️ PayPal' },
                { value: 'cash', label: '💵 Наличными при получении' },
              ].map(p => (
                <label key={p.value} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${payment === p.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-neutral-200 dark:border-neutral-700'}`}>
                  <input type="radio" name="payment" value={p.value} checked={payment === p.value} onChange={e => setPayment(e.target.value)} className="accent-blue-500"/>
                  <span className="font-medium text-sm">{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-lg">Ваш заказ</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map(i => (
                <div key={`${i.id}-${i.color}-${i.storage}`} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src={i.image} alt={i.name} className="w-8 h-8 object-contain"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{i.name}</p>
                    <p className="text-xs text-neutral-500">{i.quantity} × {i.price.toLocaleString('ru-RU')} ₽</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo */}
            <div className="flex gap-2">
              <input type="text" placeholder="Промокод" value={promo} onChange={e => setPromo(e.target.value)} className="flex-1 px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
              <button type="button" onClick={handlePromo} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition">ОК</button>
            </div>
            {promoMsg && <p className={`text-xs ${discount > 0 ? 'text-green-500' : 'text-red-500'}`}>{promoMsg}</p>}

            <div className="space-y-2 text-sm border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <div className="flex justify-between"><span className="text-neutral-500">Товары</span><span>{subtotal.toLocaleString('ru-RU')} ₽</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Доставка</span><span>{deliveryPrice > 0 ? `${deliveryPrice} ₽` : 'Бесплатно'}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-500"><span>Скидка</span><span>-{discount.toLocaleString('ru-RU')} ₽</span></div>}
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <span>Итого</span><span>{total.toLocaleString('ru-RU')} ₽</span>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-300 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-blue-500/25">
              {loading ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
