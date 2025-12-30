'use client';

import { useQuery } from '@tanstack/react-query';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
}

interface TmdbResponse {
  results: MediaItem[];
  page: number;
  total_pages: number;
}

async function fetchFromApi(endpoint: string): Promise<TmdbResponse> {
  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
  return res.json();
}

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ['trending', 'movie'],
    queryFn: () => fetchFromApi('/api/trending-movie'),
  });
};

export const useTrendingSeries = () => {
  return useQuery({
    queryKey: ['trending', 'tv'],
    queryFn: () => fetchFromApi('/api/trending-series'),
  });
};

export const useNowPlayingMovies = () => {
  return useQuery({
    queryKey: ['movie', 'now-playing'],
    queryFn: () => fetchFromApi('/api/now-playing'),
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: ['movie', 'upcoming'],
    queryFn: () => fetchFromApi('/api/upcoming'),
  });
};

export const usePopularMovies = () => {
  return useQuery({
    queryKey: ['movie', 'popular'],
    queryFn: () => fetchFromApi('/api/popular-movie'),
  });
};