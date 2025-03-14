

import { useState } from 'react';
import { useToast } from './useToast';

export function useProjectDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const deleteProject = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      toast.showSuccess('Project deleted successfully');
      setLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete project';
      setError(errorMessage);
      toast.showError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  return {
    deleteProject,
    loading,
    error
  };
}