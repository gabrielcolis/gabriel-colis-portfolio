import React, { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, tech, link }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [transitionStyle, setTransitionStyle] = useState('transform 0.5s ease-out');

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Calculate mouse position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate center of the card
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxTilt = 5; // Max tilt in degrees (subtle)

    // Calculate rotation
    // X axis rotation is based on Y position (moving mouse down rotates top towards viewer - wait, standard is inverse)
    // Let's standard tilt: Mouse top -> Tilt top down (Rotate X positive)
    // Mouse left -> Tilt left down (Rotate Y negative)

    const rotateX = ((centerY - y) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    // Remove transition during movement for instant response, keep background/color transition
    setTransitionStyle('transform 0.1s ease-out');
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setTransitionStyle('transform 0.5s ease-out');
  };

  return (
    <a
      ref={cardRef}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: `${transitionStyle}, background-color 0.5s, color 0.5s` // Merge with color transitions
      }}
      className="group block p-8 bg-gray-50 rounded-2xl hover:bg-neutral-800 hover:text-white transition-colors duration-500 h-full flex flex-col justify-between hover:shadow-2xl will-change-transform"
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <h4 className="text-2xl font-bold group-hover:gradient-text">{title}</h4>
          <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
        </div>
        <p className="text-gray-600 group-hover:text-gray-300 mb-8 text-lg font-light">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tech.map((t) => (
          <span key={t} className="text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-gray-500 border border-gray-200 group-hover:border-gray-700 px-3 py-1 rounded-full">
            {t}
          </span>
        ))}
      </div>
    </a>
  );
};

const Projects: React.FC = () => {
  // Placeholder projects based on request - modify as needed with real data
  const projects = [
    {
      title: "Backend API Integration",
      description: "A robust middleware solution solving data inconsistency issues between legacy systems and modern frontends.",
      tech: ["Java", "Spring Boot", "Rest API"],
      link: "https://github.com/gabrielcolis"
    },
    {
      title: "Process Automation Bot",
      description: "Automated workflow tool created to reduce manual data entry time by 40% using n8n and Node.js.",
      tech: ["Node.js", "n8n", "Webhooks"],
      link: "https://github.com/gabrielcolis"
    },
    {
      title: "Interactive Dashboard",
      description: "A data visualization platform for tracking real-time business metrics with complex filtering logic.",
      tech: ["React", "TypeScript", "Tailwind"],
      link: "https://github.com/gabrielcolis"
    }
  ];

  return (
    <section className="w-full py-24 bg-white" id="projects">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-4">Portfolio</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">Selected <span className="gradient-text">Work</span></h3>
          </div>
          <a href="https://github.com/gabrielcolis" className="text-black font-medium border-b border-black pb-1 hover:opacity-70 transition-opacity">
            View all on GitHub
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;