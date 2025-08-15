import type { Metadata } from 'next';

import { CONFIG } from 'src/config-global';

export const metadata: Metadata = {
  title: `Home | ${CONFIG.appName}`,
  description:
    'At FilterMart Corporation, we specialize in the sale of OEM and replacement filters for industrial applications. We have over 1 million cross-references in our product database and can also have custom filters built to your unique specifications.',
};

export default function Home() {
  return <div className="w-full">main page</div>;
}
