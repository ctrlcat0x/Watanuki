import { blogSource } from '@/lib/source';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BlogIndex() {
  const pages = blogSource.getPages();
  if (pages.length === 0) notFound();

  return (
    <main className="container mx-auto max-w-3xl py-16">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="space-y-4">
        {pages.map((page) => (
          <li key={page.url}>
            <Link href={page.url} className="text-lg font-medium hover:underline">
              {page.data.title}
            </Link>
            {page.data.description ? (
              <p className="text-fd-muted-foreground text-sm">{page.data.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
