'use client';

import { useState, useEffect } from 'react';

import { paths } from 'src/utils/paths';

export default function Navigation() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let current = 'home';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id') || 'home';
        }
      });
      setActive(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white shadow-md z-50">
      <nav className="flex justify-center space-x-8 py-4">
        {Object.entries(paths).map(([key, { label, path }]) => {
          const isExternal = path.startsWith('http');

          if (isExternal) {
            return (
              <a
                key={key}
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                {label}
              </a>
            );
          }

          const sectionId = path.replace('#', '');
          return (
            // eslint-disable-next-line react/button-has-type
            <button
              key={key}
              onClick={() => scrollToSection(sectionId)}
              className={`capitalize transition ${
                active === sectionId
                  ? 'text-blue-600 font-bold'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
