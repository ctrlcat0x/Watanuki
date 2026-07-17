'use client';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link, useRouter } from 'waku';
import type { Framework } from '@/framework/index';
import { FrameworkProvider } from '@/framework/index';

const framework: Framework = {
  Link({ href, prefetch = true, ...props }) {
    return (
      <Link to={href ?? '/'} unstable_prefetchOnEnter={prefetch} {...props}>
        {props.children}
      </Link>
    );
  },
  usePathname() {
    return useRouter().path;
  },
  useRouter() {
    const router = useRouter();

    return useMemo(
      () => ({
        push(url) {
          void router.push(url);
        },
        refresh() {
          void router.reload();
        },
      }),
      [router],
    );
  },
  useParams() {
    return {};
  },
};

export function WakuProvider({
  children,
  Link: CustomLink,
  Image: CustomImage,
}: {
  children: ReactNode;
  Link?: Framework['Link'];
  Image?: Framework['Image'];
}) {
  return (
    <FrameworkProvider
      {...framework}
      Link={CustomLink ?? framework.Link}
      Image={CustomImage ?? framework.Image}
    >
      {children}
    </FrameworkProvider>
  );
}
