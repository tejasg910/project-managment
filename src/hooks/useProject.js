import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useToast } from './useToast';

export function useSWRProjects() {
  const fetcher = async (url) => {
    const response = await fetch(url, {cache:"no-cache"});
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  };

  const { data, error, isLoading, mutate } = useSWR('/api/projects', fetcher);

  return {
    projects: data || [],
    isLoading,
    isError: error,
    mutate
  };
}



export function useProjectsFetch() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      setError(error.message || 'Failed to load projects');
      toast.showError(error.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects
  };
}