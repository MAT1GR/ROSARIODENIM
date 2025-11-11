import { useEffect, useRef } from 'react';

export const usePageFocus = (title: string, unfocusedTitle: string) => {
  const originalTitle = useRef(document.title);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = unfocusedTitle;
      } else {
        document.title = originalTitle.current;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Actualiza el título original si cambia
    originalTitle.current = title;

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [title, unfocusedTitle]);
};