// src/components/ScrollToTop.jsx
import { useEffect } from 'react';

const ScrollToTop = ({ activeIndex }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [activeIndex]); // Escuta mudanças no activeIndex

  return null;
};

export default ScrollToTop;