import Link from 'next/link';
import Image from 'next/image';

import { paths } from '../routes/paths';
import { FILTER_MART_URL } from '../utils/constants';

const REFERENCE_NUMBERS = [1, 1, 3, 7, 7, 2, 9];

export default function Header() {
  return (
    <header className="w-full mt-0 lg:mt-6 ">
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 bg-blue-500 text-white rounded-t-2xl">
        <Link href={paths.home} className="hover:opacity-90 transition-opacity">
          <Image
            src="/assets/header-logo.svg"
            alt="Filter Mart logo"
            width={149}
            height={48}
            priority
          />
        </Link>

        {/* Reference Numbers */}
        <div className="hidden md:flex items-center gap-4">
          <p className="text-base font-medium text-white hidden xl:block">
            Products Cross-Referenced
          </p>
          <div className="flex gap-2">
            {REFERENCE_NUMBERS.map((num, index) => (
              <div
                key={`ref-${index}`}
                className="flex items-center justify-center h-10 w-8 rounded-lg bg-gray-200"
              >
                <p className="text-base font-semibold text-gray-900">{num}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="#"
            aria-label="Shopping bag"
            className="p-1 hover:opacity-80 transition-opacity"
          >
            <Image src="/assets/shopping-bag.svg" alt="Shopping bag" width={24} height={24} />
          </Link>

          {/* User Dropdown */}
          <div className="relative group">
            {/* <IconButton
              variant="transparent"
              size="sm"
              className="border-none p-0 hover:opacity-80"
              aria-label="User menu"
            >
              <Image src="/assets/user-icon.svg" alt="User icon" width={24} height={24} />
            </IconButton> */}

            <div className="origin-top-right absolute right-0 p-4 rounded-lg shadow-lg bg-white invisible group-hover:visible z-40 w-48">
              <ul className="space-y-3">
                <li>
                  <Link
                    href={paths.login}
                    className="block text-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-medium rounded-lg px-4 py-3 transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href={paths.signUp}
                    className="block text-center border border-yellow-400 hover:bg-gray-50 text-gray-900 text-sm font-medium rounded-lg px-4 py-3 transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Link
            href={FILTER_MART_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg font-medium transition-all cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 px-4 text-base whitespace-nowrap"
          >
            Visit Filterfab
          </Link>
        </div>
      </nav>
    </header>
  );
}
