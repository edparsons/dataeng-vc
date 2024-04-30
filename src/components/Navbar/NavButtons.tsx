'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const linkCn =
  'flex items-center text-sm font-medium text-muted-foreground relative whitespace-nowrap py-3';
// item.disabled && "cursor-not-allowed opacity-80"
export const linkActive =
  'text-primary before:absolute before:border-b-2  before:border-b-black before:block before:h-0.25 before:rounded-full before:bottom-0 before:left-0 before:right-0';
export default function NavButtons() {
  const pathname = usePathname();
  return (
    <>
          <Link
            className={pathname == '/tools' ? `${linkCn} ${linkActive}` : linkCn}
            href="/tools">
            Tools
          </Link>
          <Link
            className={pathname == '/organizations' ? `${linkCn} ${linkActive}` : linkCn}
            href="/organizations">
            Organizations
          </Link>
          <Link
            className={pathname == '/my-org' ? `${linkCn} ${linkActive}` : linkCn}
            href="/my-org">
            My Organization
          </Link>
        </>
  );
}
