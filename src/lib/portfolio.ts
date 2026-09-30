import type { ImageMetadata } from 'astro';
import manifest from '../content/portfolio.json';

export const FEATURED_ID = 'gato-terceiro-olho';

export interface Work {
  id: string;
  featured: boolean;
  order: number;
  file: string;
  caption: string;
  region: string;
  alt: string;
  focal: string;
  fit: 'contain' | 'cover';
  source: { type: string; postUrl: string | null };
  image: ImageMetadata;
}

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/portfolio/*.{png,jpg,jpeg,webp}', {
  eager: true,
});

export function getWorks(): Work[] {
  const works = manifest.map((entry) => {
    const mod = images[`../assets/portfolio/${entry.file}`];
    if (!mod) throw new Error(`portfolio.json: arquivo ausente em src/assets/portfolio: ${entry.file}`);
    return { ...entry, fit: entry.fit as Work['fit'], image: mod.default };
  });

  const ids = new Set(works.map((w) => w.id));
  if (ids.size !== works.length) throw new Error('portfolio.json: ids duplicados.');

  const featured = works.filter((w) => w.featured);
  if (featured.length !== 1 || featured[0].id !== FEATURED_ID) {
    throw new Error(`portfolio.json: deve haver exatamente um destaque, com id "${FEATURED_ID}".`);
  }
  for (const w of works) {
    if (!w.alt.trim() || !w.caption.trim()) throw new Error(`portfolio.json: alt e caption são obrigatórios (${w.id}).`);
  }

  // O destaque é sempre o primeiro, independentemente da ordem de publicação.
  return works.sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
}
