import { useState, FormEvent } from "react";
import { checkAuth, GreenApiError } from "../api/greenApi";

interface AuthFormProps {
  onLoginSuccess: (idInstance: string, apiTokenInstance: string) => void;
}

export function AuthForm({ onLoginSuccess }: AuthFormProps) {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!idInstance.trim() || !apiTokenInstance.trim()) {
      setError("Заполните оба поля");
      return;
    }

    setError(null);
    setIsChecking(true);

    try {
      const { isAuthorized, state } = await checkAuth(
        idInstance.trim(),
        apiTokenInstance.trim(),
      );
      if (!isAuthorized) {
        setError(
          `Инстанс не авторизован (статус: ${state}). Привяжите WhatsApp-аккаунт в консоли GREEN-API`,
        );
        return;
      }
      onLoginSuccess(idInstance.trim(), apiTokenInstance.trim());
    } catch (err) {
      setError(
        err instanceof GreenApiError ? err.message : "Неизвестная ошибка",
      );
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>WhatsApp Messenger</h1>
        <p className="auth-hint">Введите данные вашего инстанса GREEN-API</p>

        <label htmlFor="idInstance">ID Instance</label>
        <input
          id="idInstance"
          type="text"
          placeholder="1101111111"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
        />

        <label htmlFor="apiTokenInstance">API Token Instance</label>
        <input
          id="apiTokenInstance"
          type="text"
          placeholder="abcdef123456789abcdef123456789"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
        />

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" disabled={isChecking}>
          {isChecking ? "Проверка..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
