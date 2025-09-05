import { useMutation, useQuery } from '@tanstack/react-query';
import { checkDuplicateNickname, signupUser } from '../api';
import { SignupRequest } from '../types';

export const useSignupUser = () => {
  const { mutateAsync } = useMutation({
    mutationFn: (param: SignupRequest) => signupUser(param),
  });

  return { signupUser: mutateAsync };
};

export const useCheckDuplicateNickname = (nickname: string) => {
  const { refetch } = useQuery({
    queryKey: ['checkDuplicateNickname', nickname],
    queryFn: () => checkDuplicateNickname(nickname),
    enabled: !!nickname, // nickname이 있을 때만 실행
  });

  return { refetch };
};
