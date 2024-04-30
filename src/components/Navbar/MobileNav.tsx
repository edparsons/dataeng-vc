'use client';

import s from './Navbar.module.css';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/src/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { linkCn, linkActive } from './NavButtons';

export default function SignOutButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <div className="text-muted-foreground">
          <Menu size={24} />
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="grid gap-4 py-4">
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

        </div>
      </SheetContent>
    </Sheet>
  );
}
