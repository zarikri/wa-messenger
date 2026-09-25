/**
 * Приводит введённый номер телефона к единому формату
 * rawPhone {string}
 * return {string | null}
 */
export function phoneToChatId(rawPhone: string): string | null {
  let digitsOnly = rawPhone.replace(/\D/g, "");

  // Проверка для номеров РФ, если написали 8 в начале, то заменяем на 7
  if (digitsOnly.length === 11 && digitsOnly.startsWith("8")) {
    digitsOnly = "7" + digitsOnly.slice(1);
  }

  if (digitsOnly.length < 10) return null;

  return `${digitsOnly}@c.us`;
}
