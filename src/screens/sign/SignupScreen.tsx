import { StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import type { SignupRequest } from '@schemas';
import { useCheckDuplicateNickname, useSignupUser } from '@hooks';
import { UserSignupSchema } from '@schemas';
import type { UserSignupFields } from '@schemas';
import { FormInput, FormInputWithButton } from '@components';
import { KeyboardLayout } from '@layout';

export const SignupScreen = () => {
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<UserSignupFields>({});
  // 중복 확인 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false);

  // zod schema 검증 함수
  const validate = (fieldName: keyof UserSignupFields, value: string): boolean => {
    let errorMessage = '';

    // 1. Zod 스키마의 해당 필드 검증
    const filedSchema = UserSignupSchema.shape[fieldName];
    const result = filedSchema.safeParse(value);
    if (!result.success) {
      errorMessage = result.error.issues[0].message;
    }

    // 2. 비밀번호 확인 추가 검증
    if (fieldName === 'confirmPassword' && value !== password) {
      errorMessage = '비밀번호가 일치하지 않습니다.';
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }));

    return errorMessage === '';
  };

  const hasError =
    Object.values(errors).some((v) => !!v) ||
    !nickname ||
    !email ||
    !password ||
    !confirmPassword ||
    !isNicknameChecked;

  // 회원가입
  const { signupUser } = useSignupUser();
  const handleSignup = async () => {
    // 최종 검증
    const result = UserSignupSchema.safeParse({ nickname, email, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: UserSignupFields = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof UserSignupFields;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      Alert.alert('회원가입 실패', '입력한 정보를 다시 확인해주세요.');
      return;
    }
    const param: SignupRequest = { nickname, email, password };
    await signupUser(param);
  };

  // 닉네임 중복확인
  const { nicknameCheck } = useCheckDuplicateNickname();
  const handleCheckDuplicateNickname = async () => {
    if (!validate('nickname', nickname)) {
      Alert.alert('닉네임 오류', '닉네임을 올바르게 입력해주세요.');
      return;
    }
    const nicknameCheckResult = await nicknameCheck(nickname);
    setIsNicknameChecked(!nicknameCheckResult);
  };

  return (
    <KeyboardLayout>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#fff' }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <FormInput
          label="이메일"
          value={email}
          onChangeText={(text: string) => {
            setEmail(text);
            validate('email', text);
          }}
          error={errors.email}
        />
        <FormInputWithButton
          label="닉네임"
          value={nickname}
          onChangeText={(text: string) => {
            setNickname(text);
            validate('nickname', text);
            setIsNicknameChecked(false);
          }}
          error={errors.nickname}
          buttonLabel={isNicknameChecked ? '완료' : '중복확인'}
          onButtonPress={handleCheckDuplicateNickname}
          disabled={isNicknameChecked}
        />
        <FormInput
          label="비밀번호"
          value={password}
          onChangeText={(text: string) => {
            setPassword(text);
            validate('password', text);
          }}
          error={errors.password}
          secureTextEntry={true}
        />
        <FormInput
          label="비밀번호 확인"
          value={confirmPassword}
          onChangeText={(text: string) => {
            setConfirmPassword(text);
            validate('confirmPassword', text);
          }}
          error={errors.confirmPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={hasError ? [styles.button, { backgroundColor: 'gray' }] : styles.button}
          onPress={handleSignup}
          disabled={hasError}
        >
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingTop: 40,
    gap: 16,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#6A49E9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
