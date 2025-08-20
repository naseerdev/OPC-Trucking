import type { Metadata } from 'next';

import Header from '@/components/header';

import { CONFIG } from 'src/config-global';

import Banner from 'src/components/sections/banner';
import AboutUs from 'src/components/sections/aboutUs';
import ContactUs from 'src/components/sections/contactUs';
import ServiceArea from 'src/components/sections/serviceArea';

export const metadata: Metadata = {
  title: `Home | ${CONFIG.appName}`,
  description: 'OPC Trucking',
};

export default function Home() {
  return (
    <main>
      <div className="sticky top-0 z-50 w-full ">
        <div className="hidden lg:block mx-auto w-[calc(100vw-20%)]">
          <Header />
        </div>
      </div>

      <div className="w-full">
        <Banner />
        <AboutUs />
        <ServiceArea />
        <ContactUs />
      </div>
    </main>
  );
}
