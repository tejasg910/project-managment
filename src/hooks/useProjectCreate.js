
// useProjectsFetch.js - Custom fetch hook with separate loading and error states
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './useToast';



export function useProjectCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const createProject = async (projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      
      const newProject = await response.json();
      toast.showSuccess('Project created successfully');
      setLoading(false);
      return newProject;
    } catch (error) {
      const errorMessage = error.message || 'Failed to create project';
      setError(errorMessage);
      toast.showError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return {
    createProject,
    loading,
    error
  };
}
