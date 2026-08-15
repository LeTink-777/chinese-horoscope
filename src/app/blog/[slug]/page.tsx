import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BambooBackground, TopBar, Footer } from '@/components/Decor';
import { BLOG_POSTS, getPostBySlug } from '@/lib/blog-posts';
import { renderArticle } from '@/lib/blog-render';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <BambooBackground />
      <div className="page">
        <TopBar />
        <main className="legal">
          <article className="shell-narrow">
            <Link href="/blog" className="legal-meta">
              ← Все статьи
            </Link>

            <h1>{post.title}</h1>

            {renderArticle(post.content)}

            <div className="card card-gold" style={{ marginTop: 40 }}>
              <h2 className="card-title">Узнайте свой прогноз на 2026 год</h2>
              <p className="card-text">
                Введите год рождения — определим ваше животное и стихию по восточному
                календарю и покажем прогноз бесплатно. Полный разбор по финансам, любви,
                карьере и здоровью придёт в PDF на почту.
              </p>
              <Link href="/" className="btn btn-gold" style={{ marginTop: 16 }}>
                Рассчитать свой знак
              </Link>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
}
