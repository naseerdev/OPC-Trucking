import type { Metadata } from 'next';

import { CONFIG } from 'src/config-global';

import Banner from 'src/components/sections/banner';
import AboutUs from 'src/components/sections/aboutUs';
import ContactUs from 'src/components/sections/contactUs';
import ServiceArea from 'src/components/sections/serviceArea';

export const metadata: Metadata = {
  title: `Home | ${CONFIG.appName}`,
  description:
    'At FilterMart Corporation, we specialize in the sale of OEM and replacement filters for industrial applications. We have over 1 million cross-references in our product database and can also have custom filters built to your unique specifications.',
};

export default function Home() {
  return (
    <div className="w-full">
      <Banner />
      <AboutUs />
      <ServiceArea />
      <ContactUs />
    </div>
  );
}
