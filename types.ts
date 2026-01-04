export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ExperienceItem {
  role: string;
  company?: string;
  period?: string;
  description: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}