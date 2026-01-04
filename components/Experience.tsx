import React from 'react';

const Experience: React.FC = () => {
  return (
    <section className="w-full py-24 bg-white border-t border-gray-100" id="experience">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4">
             <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-4">Experience</h2>
             <h3 className="text-4xl font-bold tracking-tight">Professional <br/> <span className="gradient-text">Journey</span></h3>
          </div>

          <div className="lg:col-span-8">
            <div className="relative border-l border-gray-200 ml-4 pl-10 py-4">
                {/* Timeline Dot */}
                <span className="absolute -left-1.5 top-6 w-3 h-3 bg-black rounded-full ring-4 ring-white"></span>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h4 className="text-2xl font-bold text-black">Junior Developer</h4>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">Current Position</span>
                </div>
                
                <p className="text-gray-500 mb-6 font-medium">Software Engineering</p>
                
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                    Responsible for system development and maintenance, ensuring stability and performance. 
                    I actively contribute to the implementation of complex business rules and provide technical 
                    support for existing features, optimizing workflows and resolving critical issues efficiently.
                </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;