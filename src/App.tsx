import { useState, useCallback } from "react";
import { AuthForm } from "./components/AuthForm";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";
import { usePolling } from "./hooks/usePolling";
import type { Chat, ChatMessage } from "./types/chat";
import "./styles/auth.css";
import "./styles/layout.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  function addChat(chatId: string, title: string) {
    setChats((prev) => {
      if (prev.some((c) => c.chatId === chatId)) return prev;
      return [...prev, { chatId, title, messages: [] }];
    });
    setActiveChatId(chatId);
  }

  function appendMessage(chatId: string, message: ChatMessage) {
    setChats((prev) =>
      prev.map((c) =>
        c.chatId === chatId ? { ...c, messages: [...c.messages, message] } : c,
      ),
    );
  }

  const handleIncomingMessage = useCallback(
    (chatId: string, chatName: string, message: ChatMessage) => {
      setChats((prev) => {
        const exists = prev.some((c) => c.chatId === chatId);
        if (!exists) {
          return [
            ...prev,
            { chatId, title: chatName || chatId, messages: [message] },
          ];
        }
        return prev.map((c) =>
          c.chatId === chatId
            ? { ...c, messages: [...c.messages, message] }
            : c,
        );
      });
    },
    [],
  );

  usePolling({
    idInstance,
    apiTokenInstance,
    isEnabled: isLoggedIn,
    onIncomingMessage: handleIncomingMessage,
  });

  if (!isLoggedIn) {
    return (
      <AuthForm
        onLoginSuccess={(id, token) => {
          setIdInstance(id);
          setApiTokenInstance(token);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  const activeChat = chats.find((c) => c.chatId === activeChatId) || null;

  return (
    <div className="app-layout">
      <div className="app-topbar">WhatsApp</div>
      <div className="app-body">
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onAddChat={addChat}
        />
        <ChatWindow
          chat={activeChat}
          idInstance={idInstance}
          apiTokenInstance={apiTokenInstance}
          onMessageSent={appendMessage}
        />
      </div>
    </div>
  );
}

export default App;
