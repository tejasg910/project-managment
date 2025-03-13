import useSWR from 'swr';

export function useSWRProjects() {
  const fetcher = async (url) => {
    const response = await fetch(url);
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
