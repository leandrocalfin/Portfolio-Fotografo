import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  // Inicializamos leyendo directamente si el documento ya tiene la clase dark
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      // Si no hay nada guardado, sincronizamos con lo que tenga el HTML
      const isDark = document.documentElement.classList.contains('dark');
      setDarkMode(isDark);
    }
  }, []);

  const toggleTheme = () => {
    const htmlEl = document.documentElement;
    if (htmlEl.classList.contains('dark')) {
      htmlEl.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      htmlEl.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <button 
      type="button"
      onClick={toggleTheme} 
      className="text-2xl cursor-pointer bg-transparent border-none p-0 focus:outline-none hover:scale-110 transition-transform"
      title="Cambiar tema"
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  );
}