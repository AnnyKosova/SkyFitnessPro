# API Документация

> **Важно:** Это документация для фронтенда. Все примеры кода (c-f) из исходной документации относятся к бэкенду и не используются на фронтенде.

## Базовый URL

`/api/fitness`

## Аутентификация

Все endpoints, помеченные звездочкой (\*), требуют токен авторизации в заголовке:

```
Authorization: Bearer <token>
```

Токен сохраняется в LocalStorage после успешной авторизации и автоматически добавляется к каждому запросу.

## Endpoints

### Авторизация

#### POST `/api/fitness/auth/register`

Регистрация нового пользователя.

**Требования к паролю:**

- Не менее 6 символов
- Не менее двух спецсимволов
- Не менее одной заглавной буквы

**Body:**

```json
{
  "email": "user@example.com",
  "password": "Secure@!"
}
```

**Успешный ответ (201):**

```json
{
  "message": "Регистрация прошла успешно!"
}
```

**Ошибки (400):**

- `"Введите корректный Email"` - неверный формат email
- `"Пользователь с таким email уже существует"`
- `"Пароль должен содержать не менее 6 символов"`
- `"Пароль должен содержать не менее 2 спецсимволов"`
- `"Пароль должен содержать как минимум одну заглавную букву"`

#### POST `/api/fitness/auth/login`

Авторизация пользователя.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

**Успешный ответ (200):**

```json
{
  "token": "JWT токен"
}
```

**Ошибки (400):**

- `"Пользователь с таким email не найден"`
- `"Неверный пароль"`

### Пользователь

#### GET `/api/fitness/users/me` \*

Получить данные текущего пользователя.

**Успешный ответ (200):**

```json
{
  "email": "user@example.com",
  "selectedCourses": ["idcourse1", "idcourse2"]
}
```

#### POST `/api/fitness/users/me/courses` \*

Добавить курс пользователю.

**Body:**

```json
{
  "courseId": "ypox9r"
}
```

**Успешный ответ (200):**

```json
{
  "message": "Курс успешно добавлен!"
}
```

#### DELETE `/api/fitness/users/me/courses/[courseId]` \*

Удалить курс у пользователя.

**Успешный ответ (200):**

```json
{
  "message": "Курс успешно удален!"
}
```

#### GET `/api/fitness/users/me/progress?courseId={courseId}` \*

Получить прогресс пользователя по всему курсу.

**Успешный ответ (200):**

```json
{
  "courseId": "q02a6i",
  "courseCompleted": false,
  "workoutsProgress": [
    {
      "workoutId": "17oz5f",
      "workoutCompleted": true,
      "progressData": [10, 30, 15]
    },
    {
      "workoutId": "xlpkqy",
      "workoutCompleted": false,
      "progressData": [1, 10, 4]
    }
  ]
}
```

#### GET `/api/fitness/users/me/progress?courseId={courseId}&workoutId={workoutId}` \*

Получить прогресс пользователя по конкретной тренировке.

**Успешный ответ (200):**

```json
{
  "workoutId": "17oz5f",
  "workoutCompleted": true,
  "progressData": [10, 30, 15]
}
```

### Курсы

#### GET `/api/fitness/courses`

Получить все курсы.

**Успешный ответ (200):**

```json
[
  {
    "_id": "ab1c3f",
    "nameRU": "Йога",
    "nameEN": "Yoga",
    "description": "...",
    "directions": [],
    "fitting": [],
    "workouts": ["17oz5f", "x8abc2"]
  }
]
```

#### GET `/api/fitness/courses/[courseId]`

Получить один курс по ID.

**Успешный ответ (200):**

```json
{
  "_id": "ab1c3f",
  "nameRU": "Йога",
  "nameEN": "Yoga",
  "description": "...",
  "directions": [],
  "fitting": [],
  "difficulty": "сложный",
  "durationInDays": 20,
  "dailyDurationInMinutes": {
    "from": 20,
    "to": 40
  },
  "workouts": ["17oz5f", "x8abc2"]
}
```

#### GET `/api/fitness/courses/[courseId]/workouts` \*

Получить список тренировок курса.

**Успешный ответ (200):**

```json
[
  {
    "_id": "a1rqtt",
    "name": "Урок 2. Основные движения",
    "video": "https://www.youtube.com/embed/gJPs7b8SpVw",
    "exercises": []
  }
]
```

#### PATCH `/api/fitness/courses/[courseId]/reset` \*

Удалить весь прогресс по курсу.

**Успешный ответ (200):**

```json
{
  "message": "Прогресс курса удалён!"
}
```

### Тренировки

#### GET `/api/fitness/workouts/[workoutId]` \*

Получить данные по тренировке.

**Успешный ответ (200):**

```json
{
  "_id": "a1rqtt",
  "name": "Урок 2. Основные движения",
  "video": "https://www.youtube.com/embed/gJPs7b8SpVw",
  "exercises": [
    {
      "name": "Крендель (15 повторений)",
      "quantity": 15,
      "_id": "687d11f5faa133228adcafc3"
    }
  ]
}
```

#### PATCH `/api/fitness/courses/[courseId]/workouts/[workoutId]` \*

Сохранить прогресс тренировки.

**Важно:** Длина массива `progressData` должна совпадать с количеством упражнений в тренировке.

**Body:**

```json
{
  "progressData": [10, 10, 15]
}
```

**Примеры:**

- Заполнить только третье упражнение из четырех: `[0, 0, 10, 0]`
- Обновить третье упражнение, сохранив остальные: было `[1, 7, 0, 10]`, передаем `[1, 7, 5, 10]`

**Успешный ответ (200):**

```json
{
  "message": "Прогресс сохранен"
}
```

#### PATCH `/api/fitness/courses/[courseId]/workouts/[workoutId]/reset` \*

Удалить весь прогресс по тренировке.

**Успешный ответ (200):**

```json
{
  "message": "Прогресс тренировки удалён!"
}
```

## Обработка ошибок

Все ошибки возвращаются в формате:

```json
{
  "message": "Пояснение ошибки"
}
```

### Коды ошибок:

- `400` - Ошибка валидации или некорректные данные
- `401` - Не авторизован или невалидный токен
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

## Реализация в проекте

Все API функции реализованы в:

- `src/api/fitness.ts` - основные API функции
- `src/api/client.ts` - настройка axios клиента с interceptors
- `src/types/api.ts` - TypeScript типы для всех API запросов/ответов
