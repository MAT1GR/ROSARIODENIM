import { useEffect, useRef } from 'react';

export const useScrollAnimation = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-animate-visible');
            observer.unobserve(entry.target); // Para que la animación ocurra solo una vez
          }
        });
      },
      {
        threshold: 0.1, // La animación se dispara cuando el 10% del elemento es visible
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return ref;
};