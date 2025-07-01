import { useEffect, useState } from 'react';

function Header() {
  const [visibleSection, setVisibleSection] = useState<'landing' | 'other'>('landing');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 80) {
        setVisibleSection('landing');
      } else {
        setVisibleSection('other');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initialize on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000, padding: '10px', backgroundColor: 'transparent' }}>
      <a href="#landing">
        <img
          src={visibleSection === 'landing' ? '/full_logo.png' : '/logo.png'}
          alt="logo"
          style={{ height: '155px', width: 'auto', padding: '10px', cursor: 'pointer' }}
        />
      </a>
    </div>
  );
}

export default Header;