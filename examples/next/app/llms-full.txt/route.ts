import { getLLMText, source } from '@/lib/source';
import { isLlmsEnabled } from '@/lib/seo';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET() {
  if (!isLlmsEnabled()) notFound();

  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
}
