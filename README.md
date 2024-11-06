# EduCare API Dummy

## Як використовувати:
- Встановлюємо всі залежності - `npm i`
- Запускаємо АРІ - `npm start`

## Ендпоінти
### POST /users
Реєструє користувача. Приймає дані для реєстрації, повертає об'єкт створеного користувача або помилку \
Приклад body:
```json
{
    "first_name": "First 1",
    "last_name": "Last 1",
    "email": "test1@gmail.com",
    "password": "Pass1234",
    "phone": "0123456789",
    "faculty_id": 12345,
    "role": "ROLE_JOHNDOE" (опціональне поле) 
}
```

### POST /login
Видає JWT токен. Приймає пошту і пароль користувача, повертає токен або помилку.
Приклад body:
```json
{
  "email": "test1@gmail.com",
  "password": "Pass1234"
}
```

### GET /test
**ДЛЯ ДЕБАГУ ТА ТЕСТУВАННЯ!** \
Перевіряє токен. Виводить інформацію про токен.
Токен надсилається в хедері Authorization з приставкою Bearer \
Наприклад, "Bearer CwiZW1haWwiOiJ0ZXN0MUBnbW" (реальний токен довше, це просто приклад)

### GET /faculties
Віддає всі наявні факультети

### POST /faculties
Створює новий факультет \
Приклад body:
```json
{
  "title": "Факультет Інформаційно-Комп'ютерних Технологій",
  "code": "ФІКТ"
}
```