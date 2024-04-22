'use client';

import Link from 'next/link';
import NavButtons from './NavButtons';
import MobileNav from './MobileNav';
import { useSupabase } from '../Providers/SupabaseProvider';

export default function Navbar() {
  const { user } = useSupabase();

  return (
    <nav
      className={`border-b`}>
      <a className="sr-only focus:not-sr-only" href="#skip">
        Skip to content
      </a>
      <div className="px-6 mx-auto">
        <div className="flex h-10 items-center px-4">
          <div className="flex items-center flex-1">
            <Link
              aria-label="Logo"
              className={'flex items-center space-x-2 w-12'}
              href="/">
                          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>

            </Link>
            <nav className="hidden ml-6 space-x-2 lg:flex gap-6 flex-row">
              <NavButtons />
            </nav>
          </div>
          <div className="flex justify-end flex-1 space-x-8">
            <div className="lg:hidden flex justify-center items-center">
              <MobileNav />
            </div>
            <div className="hidden lg:flex justify-center items-center space-x-4">
              { user ? user.name : <Link className={''} href="/signin">
                Sign in
              </Link> }
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
