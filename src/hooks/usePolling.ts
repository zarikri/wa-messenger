import { useEffect } from "react";
import { receiveNotification, deleteNotification } from "../api/greenApi";
import type { ChatMessage } from "../types/chat";

interface UsePollingParams {
  idInstance: string;
  apiTokenInstance: string;
  isEnabled: boolean;
  onIncomingMessage: (
    chatId: string,
    chatName: string,
    message: ChatMessage,
  ) => void;
}

/**
 * Фоновый опрос входящих сообщений
 * дергает receiveNotification => опрос сообщения => deleteNotification и повторить
 * idInstance {string}
 * apiTokenInstance {string}
 * isEnabled {boolean}
 * onIncomingMessage {function(chatId: string, chatName: string, message: ChatMessage)}
 * return {void}
 */
export function usePolling({
  idInstance,
  apiTokenInstance,
  isEnabled,
  onIncomingMessage,
}: UsePollingParams): void {
  useEffect(() => {
    if (!isEnabled) return;

    let cancelled = false;

    async function poll() {
      while (!cancelled) {
        try {
          const notification = await receiveNotification(
            idInstance,
            apiTokenInstance,
          );
          if (!notification) continue;

          const { receiptId, body } = notification;

          if (
            body.typeWebhook === "incomingMessageReceived" &&
            body.messageData?.typeMessage === "textMessage" &&
            body.senderData
          ) {
            onIncomingMessage(
              body.senderData.chatId,
              body.senderData.chatName,
              {
                id: `in-${receiptId}`,
                text: body.messageData.textMessageData?.textMessage ?? "",
                direction: "incoming",
                timestamp: Math.floor(Date.now() / 1000),
              },
            );
          }

          await deleteNotification(idInstance, apiTokenInstance, receiptId);
        } catch (err) {
          console.warn("Polling error, retrying in 3s:", err);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    }

    poll();

    return () => {
      cancelled = true;
    };
  }, [idInstance, apiTokenInstance, isEnabled, onIncomingMessage]);
}
