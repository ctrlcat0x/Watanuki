import { source } from '@/lib/source';
import { llms } from '@watanuki/core/source';
import { isLlmsEnabled } from '@/lib/seo';
import { notFound } from 'next/navigation';

export const revalidate = false;

export function GET() {
  if (!isLlmsEnabled()) notFound();

  return new Response(llms(source).index());
}
