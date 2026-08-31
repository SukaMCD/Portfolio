export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  image: string;
  alt?: string;
}

export const initialProjects: Project[] = [];

export const featuredProjects: Project[] = initialProjects;


