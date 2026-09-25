import { useState, type FormEvent } from "react";
import type { Chat } from "../types/chat";
import { phoneToChatId } from "../utils/phone";

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onAddChat: (chatId: string, title: string) => void;
}

export function ChatList({
  chats,
  activeChatId,
  onSelectChat,
  onAddChat,
}: ChatListProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const chatId = phoneToChatId(phone);

    if (!chatId) {
      setError("Введите корректный номер телефона");
      return;
    }

    onAddChat(chatId, phone.trim());
    setPhone("");
    setError(null);
  }

  return (
    <aside className="chat-list">
      <div className="chat-list-header">Чаты</div>

      <form className="new-chat-form" onSubmit={handleSubmit}>
        <input
          type="tel"
          placeholder="Номер телефона получателя"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit" aria-label="Создать чат">+</button>
      </form>
      {error && <div className="new-chat-error">{error}</div>}

      <div className="chat-list-items">
        {chats.length === 0 && (
          <div className="chat-list-empty">Пока нет чатов</div>
        )}
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          return (
            <button
              key={chat.chatId}
              className={
                "chat-list-item" +
                (chat.chatId === activeChatId ? " chat-list-item--active" : "")
              }
              onClick={() => onSelectChat(chat.chatId)}
            >
              <div className="chat-list-item-title">{chat.title}</div>
              <div className="chat-list-item-preview">
                {lastMessage ? lastMessage.text : "Нет сообщений"}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
