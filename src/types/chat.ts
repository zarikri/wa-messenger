export interface ChatMessage {
  id: string;
  text: string;
  direction: "incoming" | "outgoing";
  timestamp: number;
}

export interface Chat {
  chatId: string;
  title: string;
  messages: ChatMessage[];
}