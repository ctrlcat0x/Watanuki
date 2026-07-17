import { HomeLayout } from '@watanuki/ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/blog'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
