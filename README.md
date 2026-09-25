# WhatsApp Messenger — GREEN-API

Веб-интерфейс для отправки и получения текстовых сообщений в WhatsApp через [GREEN-API](https://console.green-api.com).
React + TypeScript + Vite.

## Требования

- Node.js 18+
- Аккаунт в [GREEN-API](https://console.green-api.com)

## Установка и запуск

\`\`\`bash
npm install
npm run dev
\`\`\`

## Как получить доступ

1. Зарегистрироваться в [console.green-api.com](https://console.green-api.com)
2. Создать инстанс WhatsApp
3. Привязать свой аккаунт WhatsApp через QR-код (Настройки → Связанные устройства)
4. Скопировать `idInstance` и `apiTokenInstance` со страницы инстанса
5. Ввести их на экране входа в приложении

## Сборка

\`\`\`bash
npm run build
\`\`\`

Собранные файлы появятся в `dist/`.
