import { source } from '@/lib/source';
import { llms } from '@watanuki/core/source';

export const revalidate = false;

export function GET() {
  return new Response(llms(source).index());
}
