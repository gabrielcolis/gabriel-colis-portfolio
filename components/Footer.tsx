import React from 'react';
import { Github, Linkedin, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-neutral-800 text-white py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter mb-2">Gabriel Henrique Colis</h2>
            <p className="text-gray-400">Software Engineering Student & Junior Developer</p>
          </div>
          
          <div className="flex gap-6 mt-8 md:mt-0">
            <a 
              href="https://github.com/gabrielcolis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 rounded-full border border-gray-600 hover:bg-[#4285F4] hover:border-[#4285F4] active:bg-[#9B72CB] active:border-[#9B72CB] transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </a>
            <a 
              href="https://www.linkedin.com/in/gabrielcolis/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 rounded-full border border-gray-600 hover:bg-[#4285F4] hover:border-[#4285F4] active:bg-[#9B72CB] active:border-[#9B72CB] transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <MapPin className="w-4 h-4" />
            <span>Curitiba, PR – Brazil</span>
          </div>
          <p>&copy; {currentYear} Gabriel Henrique Colis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;