export type Category = 'prepare' | 'teach' | 'review';

export type SchoolLink = {
  id: string;
  title: string;
  url: string;
  category: Category;
  description: string;
};

export const groups: Record<Category, { title: string; description: string; number: string }> = {
  prepare: { title: '授業の前に', description: '教材・問題集・授業準備', number: '01' },
  teach: { title: '授業の時間', description: '授業中に使う道具・資料', number: '02' },
  review: { title: '授業のあとに', description: '振り返り・引き継ぎ・運営', number: '03' }
};

export function validLink(l: unknown): l is SchoolLink {
  if (!l || typeof l !== 'object') return false;
  const item = l as Record<string, unknown>;
  const str = (v: unknown, max: number) => typeof v === 'string' && v.length <= max;
  const id = (v: unknown) => str(v, 100) && !!v;
  const url = (v: unknown) => {
    if (typeof v !== 'string' || v.length > 2000) return false;
    try {
      return ['http:', 'https:'].includes(new URL(v).protocol);
    } catch {
      return false;
    }
  };

  return (
    id(item.id) &&
    str(item.title, 200) &&
    !!(item.title as string).trim() &&
    str(item.description, 1000) &&
    url(item.url) &&
    ['prepare', 'teach', 'review'].includes(item.category as string)
  );
}

export function validLinks(links: unknown): links is SchoolLink[] {
  if (!Array.isArray(links) || links.length > 10000) return false;
  if (!links.every(validLink)) return false;
  const ids = new Set(links.map(l => l.id));
  return ids.size === links.length;
}
