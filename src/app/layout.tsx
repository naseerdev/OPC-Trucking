import '../styles/global.css';

import type { Metadata } from 'next';

import { Jura, Inter } from 'next/font/google';

import Header from '../components/header';
import Footer from '../components/Footer';
import { getBaseURL } from '../lib/util/env';

// const inter = Inter({
//   subsets: ['latin'],
//   variable: '--font-inter',
//   display: 'swap',
// });

export const inter = Inter({ subsets: ['latin'] });

const jura = Jura({
  subsets: ['latin'],
  variable: '--font-jura',
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
      className={`${inter.className} ${jura.className} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <div className="sticky top-0 z-50 w-full ">
          <div className="hidden lg:block mx-auto w-[calc(100vw-20%)]">
            <Header />
          </div>
          <div className="block lg:hidden mx-auto z-50 bg-blue-400" />
        </div>

        {children}

        <div className="w-full">
          <Footer />
        </div>
      </body>
    </html>
  );
}
