'use client';

import { useEffect, useState } from 'react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Total scrollable distance
      const totalScrollable = documentHeight - viewportHeight;

      // Avoid division by zero (when page is shorter than viewport)
      if (totalScrollable <= 0) {
        setIsVisible(false);
        return;
      }

      const scrollPercentage = (scrolled / totalScrollable) * 100;

      // Show button after scrolling past 30% of the page
      setIsVisible(scrollPercentage > 30);
    };

    // Run on scroll
    window.addEventListener('scroll', toggleVisibility);
    // Run on resize (e.g., mobile keyboard, sidebar open, images load)
    window.addEventListener('resize', toggleVisibility);

    // Initial check + small delay to let content load
    toggleVisibility();
    const timer = setTimeout(toggleVisibility, 500); // Extra check after half second

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', toggleVisibility);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => {scrollToTop; window.scrollTo({ top: 0, behavior: 'smooth' });}}
      className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full 
                 bg-white text-blue-600 shadow-xl 
                 border-2 border-blue-600
                 transition-all duration-300 ease-in-out
                 hover:bg-blue-600 hover:text-white hover:shadow-2xl
                 focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer"
      aria-label="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}