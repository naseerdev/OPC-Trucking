import Link from 'next/link';
import Image from 'next/image';

import NewsLetter from './NewsLetter';
import { paths } from '../routes/paths';

export default function Footer() {
  return (
    <footer className="w-full ">
      <NewsLetter />
      {/* Help & Links Section */}
      <div className="bg-gray-100 pt-10 lg:pt-20 pb-10">
        <div className="max-w-full lg:max-w-10/12 mx-auto text-center px-4">
          <Link href={paths.home} className="flex justify-center items-center pb-6">
            <Image
              src="/assets/filterhouse-logo.svg"
              width={256}
              height={80}
              alt="company logo"
              className="h-14 lg:h-20 w-44 lg:w-64"
            />
          </Link>
          <h4 className="text-xl lg:text-2xl font-bold mb-2 font-jura text-gray-900">
            Do You Need Help ?
          </h4>
          <p className="text-sm lg:text-base font-medium text-gray-800 max-w-[800px] mx-auto pb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>

          {/* Policy Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 border-t border-b py-10">
            <Link
              href="#"
              className="text-sm lg:text-base font-medium text-gray-800 cursor-pointer"
            >
              Terms & Conditions
            </Link>
            <span>|</span>
            <Link
              href="#"
              className="text-sm lg:text-base font-medium text-gray-800 cursor-pointer"
            >
              Return Policy
            </Link>
            <span>|</span>
            <Link
              href="#"
              className="text-sm lg:text-base font-medium text-gray-800 cursor-pointer"
            >
              Shipping Policy
            </Link>
            <span>|</span>
            <Link
              href="#"
              className="text-sm lg:text-base font-medium text-gray-800 cursor-pointer"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link
              href="#"
              className="text-sm lg:text-base font-medium text-gray-800 cursor-pointer"
            >
              CA Privacy Policy
            </Link>
          </div>

          {/* Bottom */}
          <div className="mt-4 lg:mt-10 flex flex-col md:flex-row justify-between items-start lg:items-center gap-6 lg:gap-0 text-sm ">
            <div className="flex flex-col items-start gap-4 ">
              <p className="text-sm lg:text-base font-medium text-gray-800">
                © 2025 OPCTrucking | All rights reserved.
              </p>
              <Image src="/assets/payment-icons.svg" width={282} height={16} alt="Payment icons" />
            </div>

            <div className="flex flex-col items-start gap-4">
              <p className="text-sm font-medium text-gray-800">Follow us on social media:</p>

              <div className="flex align-center justify-center gap-2">
                <Link
                  href="https://www.facebook.com/"
                  target="_blank"
                  className="h-10 w-10 flex items-center justify-center bg-white rounded-lg shadow-md hover:bg-white transition-colors"
                >
                  <Image
                    src="/assets/facebook-logo.svg"
                    width={16}
                    height={16}
                    alt="Payment icons"
                  />
                </Link>

                <Link
                  href="https://x.com/"
                  target="_blank"
                  className="h-10 w-10 flex items-center justify-center bg-white rounded-lg shadow-md hover:bg-white transition-colors"
                >
                  <Image
                    src="/assets/twitter-logo.svg"
                    width={16}
                    height={16}
                    alt="Payment icons"
                  />
                </Link>

                <Link
                  href="https://www.instagram.com/"
                  target="_blank"
                  className="h-10 w-10 flex items-center justify-center bg-white rounded-lg shadow-md hover:bg-white transition-colors"
                >
                  <Image src="/assets/insta-logo.svg" width={16} height={16} alt="Payment icons" />
                </Link>

                <Link
                  href="http://linkedin.com/"
                  target="_blank"
                  className="h-10 w-10 flex items-center justify-center bg-white rounded-lg shadow-md hover:bg-white transition-colors"
                >
                  <Image
                    src="/assets/linkdin-logo.svg"
                    width={16}
                    height={16}
                    alt="Payment icons"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
