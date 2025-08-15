import '../styles/global.css';

import type { Metadata } from 'next';

import { Bricolage_Grotesque } from 'next/font/google';

import Header from '../components/header';
import { getBaseURL } from '../lib/util/env';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <div className="sticky top-0 z-50 w-full ">
          <div className="hidden lg:block mx-auto w-[calc(100vw-20%)]">
            <Header />
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
