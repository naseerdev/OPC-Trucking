import Image from 'next/image';

import Input from './input';
import Button from './Button';

export default function NewsLetter() {
  return (
    <section className="bg-yellow-400 w-full">
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl leading-6 lg:text-2xl font-bold lg:leading-7 mb-2 lg:mb-1 font-jura text-gray-900">
          Join our newsletter for latest offers & news
        </h2>
        <p className="text-sm -5 lg:text-base lg:leading-6 font-medium text-gray-800 mb-10">
          Register now to get latest updates on promotions & coupons. Don&apos;t worry, we not spam!
        </p>

        <form className="flex justify-center max-w-[800px] mx-auto">
          <div className="flex w-full bg-white overflow-hidden rounded-lg shadow-md relative">
            <div className="flex items-center left-4 top-1/4 absolute ">
              <Image src="assets/envelope.svg" width={20} height={20} alt="email sign" />
            </div>
            <Input
              placeholder="Enter your email address"
              aria-label="Email address"
              className="rounded-s-none rounded-e-none ps-12"
            />
            <Button
              variant="dark"
              size="sm"
              className="px-6 sm:px-10 whitespace-nowrap rounded-s-none"
            >
              Send
            </Button>
          </div>
        </form>

        <p className="text-sm leading-5 lg:text-base lg:leading-6 text-gray-800 mt-3">
          By subscribing you agree to our{' '}
          <span className="font-bold text-gray-900">
            Terms & Conditions Privacy & Cookies Policy
          </span>
          .
        </p>
      </div>
    </section>
  );
}
