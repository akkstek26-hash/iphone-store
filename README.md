# iPhone Store

Полноценный интернет-магазин iPhone в стиле Apple Store. 48 моделей iPhone от 2G до 17 Pro Max.

## Технологии

**Frontend:** Next.js 15, React, TypeScript, Tailwind CSS, Zustand  
**Backend:** Node.js, Express.js, MongoDB, JWT  
**Инфраструктура:** Docker, Docker Compose

## Быстрый старт

### С Docker (рекомендуется)

```bash
docker-compose up -d
# Затем посеять данные:
docker-compose exec backend node src/seeds/seed.js
```

Сайт: http://localhost:3000  
API: http://localhost:5000

### Без Docker

**1. MongoDB** — установите и запустите MongoDB локально

**2. Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run seed    # Заполнить базу 48 моделями iPhone
npm run dev     # Запуск на :5000
```

**3. Frontend:**
```bash
cd frontend
npm install
npm run dev     # Запуск на :3000
```

## Демо-аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Админ | admin@iphonestore.com | admin123 |
| Пользователь | user@example.com | user123 |

## Промокоды

- `APPLE10` — скидка 10%
- `WELCOME15` — скидка 15%
- `IPHONE20` — скидка 20%
- `VIP25` — скидка 25%

## Функционал

### Покупатель
- Каталог с фильтрами (цена, память, цвет, год, категория)
- Поиск по товарам
- Карточка товара с характеристиками, цветами, памятью
- Корзина с изменением количества
- Промокоды
- Оформление заказа (доставка, оплата)
- Личный кабинет с историей заказов
- Избранное
- Тёмная тема
- Адаптивный дизайн

### Администратор
- Dashboard со статистикой
- Управление заказами (10 статусов)
- Управление товарами (CRUD)
- Просмотр клиентов
- ТОП продаж

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
POST   /api/auth/favorites/:id

GET    /api/products
GET    /api/products/:slug
POST   /api/products (admin)
PUT    /api/products/:id (admin)
DELETE /api/products/:id (admin)

POST   /api/orders
GET    /api/orders/my
GET    /api/orders/:id
GET    /api/orders (admin)
PUT    /api/orders/:id/status (admin)
GET    /api/orders/admin/stats (admin)

GET    /api/admin/dashboard
GET    /api/admin/users
```

## Статусы заказов

Новый → Подтверждён → В обработке → Упаковывается → Отправлен → В пути → Доставляется → Доставлен → Завершён / Отменён
