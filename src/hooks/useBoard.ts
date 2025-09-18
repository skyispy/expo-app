import { useQuery } from '@tanstack/react-query';
import { getBoards } from '../api';

export const useGetBoards = (category: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['boards', category],
    queryFn: () => getBoards(category),
  });

  return { boards: data, isBoardsLoading: isLoading };
}