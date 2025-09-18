import apiClient from './config';
import { AxiosError } from 'axios';
import { ApiResponse, Board } from '../types';

export const getBoards = async (category: string) => {
  try {
    const response: ApiResponse<Board[]> = await apiClient.get('/board', {
      params: { category },
    });
    return response.data;
  } catch (error) {
    if(error instanceof AxiosError) {
      console.error('api/board -> Failed to fetch events');
    }
  }
}