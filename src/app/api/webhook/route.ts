import { NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdf-generator';
import { sendResultEmail } from '@/lib/email';
import {
  buildSubtitle,
  generateResultSections,
  inputFromMetadata,
} from '@/lib/result-sections';
import { clientIp, isYookassaAddress } from '@/lib/webhook-guard';
import { SITE_NAME } from '@/lib/site-name';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface WebhookBody {
  type?: string;
  event?: string;
  object?: {
    id?: string;
    status?: string;
    paid?: boolean;
    amount?: { value?: string; currency?: string };
    metadata?: Record<string, string>;
  };
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (!isYookassaAddress(ip)) {
    console.warn('[webhook] уведомление с неизвестного адреса отклонено', { ip });
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: WebhookBody;

  try {
    body = (await request.json()) as WebhookBody;
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  const event = body.event ?? '';
  const payment = body.object ?? {};

  switch (event) {
    case 'payment.succeeded':
      console.log('[webhook] payment.succeeded', {
        id: payment.id,
        amount: payment.amount?.value,
        plan: payment.metadata?.plan,
        email: payment.metadata?.email,
        animal: payment.metadata?.animal,
        birthYear: payment.metadata?.birthYear,
      });

      await deliverReport(payment.metadata ?? {}, payment.id ?? null);
      break;

    case 'payment.canceled':
      console.log('[webhook] payment.canceled', { id: payment.id });
      break;

    case 'refund.succeeded':
      console.log('[webhook] refund.succeeded', { id: payment.id });
      break;

    default:
      console.log('[webhook] unhandled event', { event, id: payment.id });
  }

  // ЮKassa считает уведомление доставленным при любом ответе 200.
  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

/**
 * Защита от повторной отправки одного и того же прогноза.
 *
 * ЮKassa повторяет уведомление, пока не получит 200, поэтому доставка,
 * завершившаяся после медленного ответа, ушла бы покупателю дважды. Множество
 * живёт в памяти инстанса и покрывает только повторы, попавшие на тот же
 * прогретый процесс — надёжное решение это запись заказа в базе, которой у
 * проекта пока нет.
 */
const delivered = new Set<string>();

async function deliverReport(
  metadata: Record<string, string>,
  paymentId: string | null,
): Promise<void> {
  if (paymentId && delivered.has(paymentId)) {
    console.log('[webhook] прогноз уже отправлен, пропускаем', { paymentId });
    return;
  }

  const email = metadata.email;
  const input = inputFromMetadata(metadata);

  if (!email || !input) {
    console.error('[webhook] недостаточно данных для отправки прогноза', {
      paymentId,
      hasEmail: Boolean(email),
      hasInput: Boolean(input),
    });
    return;
  }

  const userName = input.name || 'Дорогой клиент';

  try {
    const sections = generateResultSections(input, metadata.plan);

    const pdfBuffer = await generatePDF({
      title: 'Твой китайский гороскоп на 2026',
      userName,
      subtitle: buildSubtitle(input),
      sections,
      siteName: SITE_NAME,
    });

    await sendResultEmail({
      to: email,
      subject: 'Твой китайский гороскоп на 2026 готов',
      userName,
      resultHtml: sections
        .map(
          (section) =>
            `<h3 style="color:#D4A017;font-size:17px;margin:24px 0 8px;">${section.title}</h3>` +
            `<p style="font-size:15px;line-height:1.6;margin:0;white-space:pre-line;">${section.content}</p>`,
        )
        .join(''),
      pdfBuffer,
      fileName: 'kitayskiy-goroskop.pdf',
      siteName: SITE_NAME,
    });

    if (paymentId) delivered.add(paymentId);

    console.log('[webhook] прогноз отправлен', { paymentId, to: email });
  } catch (error) {
    // Ошибку намеренно не пробрасываем: ответ всё равно 200. Ответ не-200
    // заставит ЮKassa повторять уведомление часами, а сбой здесь относится к
    // доставке, а не к платежу — деньги уже приняты в любом случае.
    console.error('[webhook] не удалось отправить прогноз', {
      paymentId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
