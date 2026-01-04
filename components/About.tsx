import React from 'react';

const About: React.FC = () => {
  return (
    <section className="w-full py-24 bg-[#F3F4F6] text-black" id="about">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Image Section */}
        <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-500">
                {/* 
                   Updated to use the specific provided photo.
                   Please ensure the file is named 'gabriel-colis.jpg' in your public folder.
                */}
                <img 
                    src="/gabriel-colis.jpg" 
                    alt="Gabriel Henrique Colis" 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80"; // Fallback image
                    }}
                />
            </div>
        </div>
        
        {/* Text Section */}
        <div className="lg:col-span-8 space-y-8">
          <div>
             <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-4">About Me</h2>
             <h3 className="text-4xl font-bold tracking-tight">The intersection of <span className="gradient-text">logic</span> and <span className="gradient-text">creation</span>.</h3>
          </div>
          
          <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-800">
            I am a Software Engineering student and currently working as a <span className="font-semibold text-black">Junior Developer</span>. My professional journey is defined by a technical, practical profile oriented toward solving real-world problems.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="border-l-2 border-gray-300 pl-6">
              <h4 className="text-lg font-semibold mb-2">Focus</h4>
              <p className="text-gray-600">Specializing in Web and Backend development, building robust systems that scale.</p>
            </div>
            <div className="border-l-2 border-gray-300 pl-6">
              <h4 className="text-lg font-semibold mb-2">Approach</h4>
              <p className="text-gray-600">Translating complex business requirements into clean, maintainable code.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;