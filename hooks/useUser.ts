import { useMutation } from '@tanstack/react-query';
import { signupUser } from '../api';
import { SignupRequest } from '../types';

export const useSignupUser = () => {
  const { mutateAsync } = useMutation({
    mutationFn: (param: SignupRequest) =>
      signupUser(param),
  });

  return { signupUser: mutateAsync };
};