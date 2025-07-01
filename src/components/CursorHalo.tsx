import { useEffect, useRef } from 'react';
import './CursorHalo.css';

function CursorHalo() {
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveHalo = (e: MouseEvent) => {
      if (haloRef.current) {
        haloRef.current.style.left = `${e.clientX}px`;
        haloRef.current.style.top = `${e.clientY}px`;
      }
    };

    document.addEventListener('mousemove', moveHalo);
    return () => document.removeEventListener('mousemove', moveHalo);
  }, []);

  return <div className="cursor-halo" ref={haloRef}></div>;
}

export default CursorHalo;