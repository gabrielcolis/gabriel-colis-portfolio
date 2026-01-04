import React from 'react';
import { Database, Layout, Code2, Server, Globe, Wrench } from 'lucide-react';

interface TechCategoryProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  highlight?: boolean;
}

const TechCategory: React.FC<TechCategoryProps> = ({ title, icon, items, highlight = false }) => (
  <div className={`p-8 rounded-2xl transition-all duration-300 ${highlight ? 'bg-neutral-800 text-white' : 'bg-gray-50 hover:bg-gray-100 text-black'}`}>
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span 
          key={item} 
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            highlight 
              ? 'bg-white/10 text-white border border-white/20' 
              : 'bg-white text-gray-800 border border-gray-200'
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

const TechStack: React.FC = () => {
  return (
    <section className="w-full py-24 bg-white" id="technologies">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-4">Technologies</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">My <span className="gradient-text">Arsenal</span></h3>
          <p className="text-gray-600 max-w-xl text-lg">
            A curated set of tools and languages I use to bring ideas to life, prioritizing efficiency and scalability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main Tech - Highlighted */}
            <div className="md:col-span-2 lg:col-span-1">
                <TechCategory 
                    title="Main Focus" 
                    icon={<Database className="w-6 h-6 text-[#9B72CB]" />}
                    items={['Java', 'Grails', 'AI']} 
                    highlight={true}
                />
            </div>

            {/* Other Tech */}
            <TechCategory 
                title="Frontend & Web" 
                icon={<Layout className="w-6 h-6 text-[#4285F4]" />}
                items={['React', 'JavaScript', 'HTML5/CSS3']} 
            />

            <TechCategory 
                title="Backend & Scripting" 
                icon={<Server className="w-6 h-6 text-[#4285F4]" />}
                items={['Node.js', 'PHP', 'n8n', 'WordPress']} 
            />

             <TechCategory 
                title="Tools" 
                icon={<Wrench className="w-6 h-6 text-[#9B72CB]" />}
                items={['Git', 'Figma', 'VS Code', 'IntelliJ', 'Antigravity']} 
            />
            
            <TechCategory 
                title="Soft Skills & Languages" 
                icon={<Globe className="w-6 h-6 text-[#4285F4]" />}
                items={['English (TOEIC B2)', 'Problem Solving', 'Communication']} 
            />

            <TechCategory 
                title="Creative & Other" 
                icon={<Code2 className="w-6 h-6 text-[#9B72CB]" />}
                items={['Photoshop', 'Premiere', 'After Effects', 'C# (Course)']} 
            />
        </div>
      </div>
    </section>
  );
};

export default TechStack;