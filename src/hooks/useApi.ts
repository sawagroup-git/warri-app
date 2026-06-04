import { useCallback, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface UseApiOptions {
  baseURL?: string;
  headers?: Record<string, string>;
}

/**
 * Hook for handling API requests with loading and error states
 */
export const useApi = <T>(options?: UseApiOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: options?.baseURL || process.env.API_URL || 'http://localhost:3000',
    headers: options?.headers,
  });

  const request = useCallback(
    async (
      url: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
      payload?: any
    ): Promise<ApiResponse<T>> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api({
          url,
          method,
          data: payload,
        });

        setData(response.data.data);
        return {
          success: true,
          data: response.data.data,
        };
      } catch (err) {
        const axiosError = err as AxiosError<ApiResponse<T>>;
        const errorMessage =
          axiosError.response?.data?.error || 'An error occurred';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [api]
  );

  const get = useCallback(
    (url: string) => request(url, 'GET'),
    [request]
  );

  const post = useCallback(
    (url: string, payload: any) => request(url, 'POST', payload),
    [request]
  );

  const put = useCallback(
    (url: string, payload: any) => request(url, 'PUT', payload),
    [request]
  );

  const del = useCallback(
    (url: string) => request(url, 'DELETE'),
    [request]
  );

  return { data, isLoading, error, request, get, post, put, del };
};
