import { MONTHS_RU, calculateChinese } from '@/lib/chineseZodiac';
import type { PdfSection } from '@/lib/pdf-generator';

/**
 * Собирает разделы прогноза для PDF в письме, PDF по кнопке и открытого
 * результата на /thank-you — чтобы все три источника совпадали.
 *
 * Всё содержание берётся из calculateChinese() в src/lib/chineseZodiac.ts,
 * то есть из того же расчёта, который показывает бесплатная страница
 * результата.
 */

export type ChineseInput = {
  name: string;
  birthYear: number;
};

/**
 * Базовый тариф открывает портрет знака и общий прогноз; полный и премиум
 * добавляют финансы, любовь, карьеру, здоровье и календарь года.
 */
function sectionCountForPlan(plan: string | null | undefined): number {
  return plan === 'basic' ? 2 : 8;
}

export function generateResultSections(
  input: ChineseInput,
  plan: string | null | undefined
): PdfSection[] {
  if (!Number.isFinite(input.birthYear)) return [];

  const result = calculateChinese(input.name, input.birthYear);
  const year = result.year2026data;

  const all: PdfSection[] = [
    {
      // Иероглиф знака сюда не идёт: шрифт PDF subset'ится до латиницы и
      // кириллицы, и CJK-глиф отрисовался бы пустым квадратом.
      title: `Твой знак — ${result.animal}, стихия ${result.element.name}`,
      content: `${result.elementDescription}\n\nСовместимость со Змеёй 2026: ${result.compatibility.label}. ${result.compatibility.description}`,
    },
    {
      title: `Общий прогноз на 2026 — ${year.overall} из 100`,
      content: year.overallText,
    },
    {
      title: 'Финансы',
      content: year.finance,
    },
    {
      title: 'Любовь и отношения',
      content: year.love,
    },
    {
      title: 'Карьера',
      content: year.career,
    },
    {
      title: 'Здоровье',
      content: year.health,
    },
    {
      title: 'Календарь года',
      content: `Лучшие месяцы: ${year.bestMonths.join(', ')}.\nМесяцы повышенного риска: ${year.dangerMonths.join(', ')}.\n\nВ сильные месяцы имеет смысл начинать и договариваться, в рискованные — не подписывать крупное и не выяснять отношения на эмоциях. Всего в году ${MONTHS_RU.length} месяцев, и ни один из них не закрыт для тебя полностью.`,
    },
    {
      title: 'Талисманы и совет года',
      content: `Число удачи: ${year.luckyNumber}. Цвет года: ${year.luckyColor}.\nТалисманы: ${year.talismans.join(', ')}.\n\n${year.advice}`,
    },
  ];

  return all.slice(0, sectionCountForPlan(plan));
}

/** Читает данные покупателя из metadata ЮKassa — там всё приходит строками. */
export function inputFromMetadata(
  metadata: Record<string, string>
): ChineseInput | null {
  const birthYear = Number(metadata.birthYear);
  if (!Number.isFinite(birthYear) || birthYear <= 0) return null;

  return { name: metadata.name || '', birthYear };
}

/** Строка под заголовком отчёта: имя, знак и год рождения. */
export function buildSubtitle(input: ChineseInput): string {
  const result = calculateChinese(input.name, input.birthYear);
  const who = input.name ? `${input.name} · ` : '';
  return `${who}${result.animal} · ${input.birthYear}`;
}
