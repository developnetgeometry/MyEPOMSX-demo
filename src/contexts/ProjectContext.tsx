
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Project = {
  id: string;
  name: string;
  route?: string;
};

type ProjectContextType = {
  currentProject: Project;
  setCurrentProject: (project: Project) => void;
  projects: Project[];
};

const defaultProjects = [
  { id: '1', name: 'Project Alpha' },
  { id: '2', name: 'Project Beta' },
  { id: '3', name: 'Project Gamma' },
  { id: '4', name: 'Project Delta' },
  { id: '5', name: 'Project Epsilon' },
];

const defaultContext: ProjectContextType = {
  currentProject: defaultProjects[0],
  setCurrentProject: () => {},
  projects: defaultProjects,
};

const ProjectContext = createContext<ProjectContextType>(defaultContext);

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [currentProject, setCurrentProject] = useState<Project>(defaultContext.currentProject);
  
  const value = {
    currentProject,
    setCurrentProject,
    projects: defaultProjects,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
