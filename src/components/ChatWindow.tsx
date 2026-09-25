import { useState, type FormEvent } from "react";
import type { Chat, ChatMessage } from "../types/chat";
import { sendMessage, GreenApiError } from "../api/greenApi";

interface ChatWindowProps {
  chat: Chat | null;
  idInstance: string;
  apiTokenInstance: string;
  onMessageSent: (chatId: string, message: ChatMessage) => void;
}

export function ChatWindow({
  chat,
  idInstance,
  apiTokenInstance,
  onMessageSent,
}: ChatWindowProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!chat) {
    return (
      <main className="chat-window chat-window--empty">
        <p>Выберите чат слева или создайте новый по номеру телефона</p>
      </main>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsSending(true);
    setError(null);

    try {
      await sendMessage(idInstance, apiTokenInstance, chat!.chatId, trimmed);
      onMessageSent(chat!.chatId, {
        id: `local-${Date.now()}`,
        text: trimmed,
        direction: "outgoing",
        timestamp: Math.floor(Date.now() / 1000),
      });
      setText("");
    } catch (err) {
      setError(err instanceof GreenApiError ? err.message : "Ошибка отправки");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="chat-window">
      <header className="chat-window-header">{chat.title}</header>

      <div className="message-list">
        {chat.messages.length === 0 && (
          <div className="message-list-empty">Нет сообщений</div>
        )}
        {chat.messages.map((m) => (
          <div
            key={m.id}
            className={
              "message-bubble" +
              (m.direction === "outgoing"
                ? " message-bubble--out"
                : " message-bubble--in")
            }
          >
            <div className="message-bubble-text">{m.text}</div>
          </div>
        ))}
      </div>

      <form className="message-input" onSubmit={handleSubmit}>
        {error && <div className="message-input-error">{error}</div>}
        <div className="message-input-row">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Написать сообщение..."
          />
          <button type="submit" disabled={isSending || !text.trim()}>
            {isSending ? "Отправка..." : "Отправить"}
          </button>
        </div>
      </form>
    </main>
  );
}
