
import { useState } from 'react';
import { useToast } from './useToast';

export function useProjectUpdate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const updateProject = async (projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/projects/${projectData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      
      const updatedProject = await response.json();
      toast.showSuccess('Project updated successfully');
      setLoading(false);
      return updatedProject;
    } catch (error) {
      const errorMessage = error.message || 'Failed to update project';
      setError(errorMessage);
      toast.showError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return {
    updateProject,
    loading,
    error
  };
}
