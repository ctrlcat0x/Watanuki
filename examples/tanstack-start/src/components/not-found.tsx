import { baseOptions } from '@/lib/layout.shared';
import { HomeLayout } from '@watanuki/ui/layouts/home';
import { DefaultNotFound } from '@watanuki/ui/layouts/home/not-found';

export function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <DefaultNotFound />
    </HomeLayout>
  );
}
