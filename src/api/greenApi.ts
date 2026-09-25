const API_URL = "https://api.green-api.com";

export class GreenApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GreenApiError";
  }
}

interface GetStateInstanceResponse {
  stateInstance: string;
}

/**
 * Получение состояния аккаунта 
 * idInstance {string}
 * apiTokenInstance {string}
 * return {Promise<{ isAuthorized: boolean; state: string }>}
 */
export async function checkAuth(
  idInstance: string,
  apiTokenInstance: string,
): Promise<{ isAuthorized: boolean; state: string }> {
  const url = `${API_URL}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new GreenApiError("Не удалось подключиться к GREEN-API");
  }

  if (!response.ok) {
    throw new GreenApiError("Неверные idInstance или apiTokenInstance");
  }

  const data = (await response.json()) as GetStateInstanceResponse;
  return {
    isAuthorized: data.stateInstance === "authorized",
    state: data.stateInstance,
  };
}

interface SendMessageResponse {
  idMessage: string;
}

/**
 * Отправка сообщения в чат
 * idInstance {string}
 * apiTokenInstance {string}
 * chatId {string}
 * message {string}
 * return {Promise<string>}
 */
export async function sendMessage(
  idInstance: string,
  apiTokenInstance: string,
  chatId: string,
  message: string,
): Promise<string> {
  const url = `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, message }),
    });
  } catch {
    throw new GreenApiError("Не удалось подключиться к GREEN-API");
  }

  if (!response.ok) {
    throw new GreenApiError("Не удалось отправить сообщение");
  }

  const data = (await response.json()) as SendMessageResponse;
  return data.idMessage;
}

interface ReceiveNotificationResponse {
  receiptId: number;
  body: {
    typeWebhook: string;
    senderData?: {
      chatId: string;
      chatName: string;
    };
    messageData?: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
  };
}

/**
 * Получение одного входящего уведомления из очереди уведомлений
 * idInstance {string}
 * apiTokenInstance {string}
 * receiveTimeout {number | undefined}
 * return {Promise<ReceiveNotificationResponse | null>}
 */
export async function receiveNotification(
  idInstance: string,
  apiTokenInstance: string,
  receiveTimeout: number | undefined = 5,
): Promise<ReceiveNotificationResponse | null> {
  const url = `${API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=${receiveTimeout}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new GreenApiError("Ошибка получения уведомлений");
  }

  const data = await response.json();
  return data === null ? null : (data as ReceiveNotificationResponse);
}

/**
 * Удаление входящего уведомления из очереди уведомлений
 * idInstance {string}
 * apiTokenInstance {string}
 * receiptId {number}
 * return {Promise<void>}
 */
export async function deleteNotification(
  idInstance: string,
  apiTokenInstance: string,
  receiptId: number,
): Promise<void> {
  const url = `${API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
  await fetch(url, { method: "DELETE" });
}
