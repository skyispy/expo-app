import { useMutation } from '@tanstack/react-query';
import { checkDuplicateNickname, signupUser } from '../api';
import { SignupRequest } from '../types';

export const useSignupUser = () => {
  const { mutateAsync } = useMutation({
    mutationFn: (param: SignupRequest) =>
      signupUser(param),
  });

  return { signupUser: mutateAsync };
};

export const useCheckDuplicateNickname = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (nickname: string) => {
      const data = await checkDuplicateNickname(nickname);
      if (!data) throw new Error('닉네임 중복 확인에 실패했습니다.');
      return data;
    }
  });

  return { checkDuplicateNickname: mutateAsync };
}