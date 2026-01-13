# Инструкции по настройке проекта

## 1. Установка зависимостей

Выполните в терминале:
```bash
npm install
```

Если возникнут проблемы с npm, попробуйте:
```bash
npm install --legacy-peer-deps
```

## 2. Создание .env.local

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_API_URL=/api/fitness
```

Для продакшн замените на реальный URL API.

## 3. Запуск проекта

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## 4. Создание GitHub репозитория

### Вариант 1: Создать новый репозиторий на GitHub

1. Создайте новый репозиторий на GitHub (не инициализируйте его с README)
2. Выполните в терминале:

```bash
git init
git add .
git commit -m "Initial commit: Next.js project setup with TypeScript, API client, and Auth context"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SkyFitnessPro.git
git push -u origin main
```

### Вариант 2: Если репозиторий уже создан

```bash
git init
git add .
git commit -m "Initial commit: Next.js project setup with TypeScript, API client, and Auth context"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## 5. Проверка настройки

После установки зависимостей проверьте:

```bash
# Проверка линтера
npm run lint

# Проверка форматирования
npm run format:check

# Проверка TypeScript
npx tsc --noEmit
```

## Готово к разработке! 🚀

Теперь можно приступать к верстке страниц по макету.
