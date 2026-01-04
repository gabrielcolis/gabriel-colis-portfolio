import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-white/90 backdrop-blur-sm shadow-sm' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className={`font-bold text-xl tracking-tighter transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
          GHC.
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com/gabrielcolis" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 text-gray-700 group-hover:text-black" />
          </a>
          <a 
            href="https://www.linkedin.com/in/gabrielcolis/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 text-gray-700 group-hover:text-black" />
          </a>
          <a 
            href="https://wa.me/5541991563866" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-[#4285F4] active:bg-[#9B72CB] transition-colors duration-300 ease-in-out"
          >
            Get in touch
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;