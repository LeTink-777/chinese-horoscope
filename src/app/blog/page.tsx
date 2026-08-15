import type { Metadata } from 'next';
import Link from 'next/link';
import { BambooBackground, TopBar, Footer } from '@/components/Decor';
import { BLOG_POSTS } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Блог о китайском гороскопе — прогнозы, годы, животные, стихии',
  description:
    'Статьи о китайском гороскопе: год какого животного 2026, таблица по годам рождения, прогнозы по месяцам, совместимость и стихии восточного календаря.',
  alternates: { canonical: '/blog' },
  robots: { index: true, follow: true },
};

export default function BlogIndexPage() {
  return (
    <>
      <BambooBackground />
      <div className="page">
        <TopBar />
        <main className="legal">
          <div className="shell-narrow">
            <h1>Китайский гороскоп: статьи и разборы</h1>
            <p className="legal-meta">
              Как устроен восточный календарь, что несёт год Огненной Лошади и как
              определить своё животное и стихию по году рождения.
            </p>

            <div style={{ display: 'grid', gap: 12, marginTop: 32 }}>
              {BLOG_POSTS.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="card">
                  <h2 className="card-title">{post.title}</h2>
                  <p className="card-text">{post.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
