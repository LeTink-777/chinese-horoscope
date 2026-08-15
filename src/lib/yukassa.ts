/**
 * ЮKassa — создание платежа через REST API v3.
 * payment_method_type намеренно не передаётся: пользователю доступны
 * все методы оплаты, подключённые в личном кабинете магазина.
 */

const API_URL = 'https://api.yookassa.ru/v3/payments';

export interface CreatePaymentInput {
  amount: number;
  description: string;
  returnUrl: string;
  metadata?: Record<string, string | number>;
  customerEmail?: string;
}

export interface YooKassaPayment {
  id: string;
  status: string;
  paid: boolean;
  confirmation?: { type: string; confirmation_url?: string };
  metadata?: Record<string, string>;
}

function credentials(): { shopId: string; secretKey: string } {
  const shopId = process.env.NEXT_PUBLIC_YUKASSA_SHOP_ID;
  const secretKey = process.env.YUKASSA_SECRET_KEY;

  if (!shopId || !secretKey) {
    throw new Error(
      'Не заданы переменные окружения NEXT_PUBLIC_YUKASSA_SHOP_ID и YUKASSA_SECRET_KEY',
    );
  }

  return { shopId, secretKey };
}

/**
 * Читает платёж по идентификатору.
 *
 * Нужен, чтобы подтвердить: запрос на скачивание относится к реально
 * оплаченному заказу, и чтобы взять данные покупателя из самого платежа,
 * а не из тела запроса браузера.
 */
export async function getPayment(paymentId: string): Promise<YooKassaPayment | null> {
  const { shopId, secretKey } = credentials();
  const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64');

  const response = await fetch(`${API_URL}/${encodeURIComponent(paymentId)}`, {
    method: 'GET',
    headers: { Authorization: `Basic ${auth}` },
    cache: 'no-store',
  });

  if (!response.ok) return null;

  return (await response.json()) as YooKassaPayment;
}

export async function createPayment(input: CreatePaymentInput): Promise<YooKassaPayment> {
  const { shopId, secretKey } = credentials();
  const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64');

  const body: Record<string, unknown> = {
    amount: {
      value: input.amount.toFixed(2),
      currency: 'RUB',
    },
    capture: true,
    confirmation: {
      type: 'redirect',
      return_url: input.returnUrl,
    },
    description: input.description.slice(0, 128),
    metadata: input.metadata ?? {},
  };

  // Чек отправляем только если в магазине подключена фискализация,
  // иначе ЮKassa отклонит платёж с ошибкой валидации.
  if (input.customerEmail && process.env.YUKASSA_SEND_RECEIPT === 'true') {
    body.receipt = {
      customer: { email: input.customerEmail },
      items: [
        {
          description: input.description.slice(0, 128),
          quantity: '1.00',
          amount: { value: input.amount.toFixed(2), currency: 'RUB' },
          vat_code: 1,
          payment_mode: 'full_payment',
          payment_subject: 'service',
        },
      ],
    };
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Idempotence-Key': crypto.randomUUID(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const payload = (await response.json()) as YooKassaPayment & {
    description?: string;
    code?: string;
  };

  if (!response.ok) {
    throw new Error(
      `ЮKassa вернула ошибку ${response.status}: ${payload.description ?? payload.code ?? 'unknown'}`,
    );
  }

  return payload;
}
