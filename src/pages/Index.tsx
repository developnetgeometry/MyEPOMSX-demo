
import React from 'react';
import Overview from './Overview';
import { useProject } from '@/contexts/ProjectContext';

const Index = () => {
  const { currentProject } = useProject();
  
  console.log(`Loading data for project: ${currentProject.name} (ID: ${currentProject.id})`);
  
  return <Overview />;
};

export default Index;
