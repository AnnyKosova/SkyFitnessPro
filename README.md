# SkyFitness Pro

Онлайн‑платформа для занятий фитнесом дома. Доступны курсы (йога, стретчинг, фитнес, степ‑аэробика, бодифлекс), работа с прогрессом и личным профилем.

## Демо
https://sky-fitness-pro-beta.vercel.app

## Технологии
- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules
- Axios
- React Context
- Jest + React Testing Library
- ESLint + Prettier

## Функциональность
### Для всех пользователей
- просмотр списка курсов
- просмотр страницы курса
- авторизация и регистрация

### Для авторизованных пользователей
- добавление/удаление курсов в профиль
- просмотр прогресса по курсам
- просмотр тренировок курса
- заполнение прогресса упражнений

## Страницы
- Главная: `/`
- Курс: `/courses/[courseId]`
- Профиль: `/profile`
- Тренировка: `/workouts/[workoutId]`

## Установка и запуск
### Требования
- Node.js 18+
- npm

### Установка зависимостей
```bash
npm install
```

### Переменные окружения
Создайте `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://wedev-api.sky.pro/api/fitness
```

### Запуск в dev-режиме
```bash
npm run dev
```
Приложение будет доступно по адресу `http://localhost:3000`.

### Сборка/запуск prod
```bash
npm run build
npm run start
```

### Тесты
```bash
npm test
```

## Деплой
Приложение задеплоено на Vercel.