import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SignStackScreenProps, SignupRequest } from '../../types';
import { useCheckDuplicateNickname, useSignupUser } from '../../hooks';
import { UserSignupSchema } from '../../schemas';
import type { UserSignupFields } from '../../schemas';
import { FormInput, FormInputWithButton } from '@components/sign';

export const SignupScreen = () => {
  const stackNav = useNavigation<SignStackScreenProps>();

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
    Object.values(errors).some((v) => !!v) || !nickname || !email || !password || !confirmPassword;

  // 회원가입
  const { signupUser } = useSignupUser();
  const handleSignup = async () => {
    if (hasError) {
      Alert.alert('회원가입 오류', '입력한 내용을 다시 확인해주세요.');
      return;
    }
    if (!isNicknameChecked) {
      Alert.alert('닉네임 오류', '닉네임 중복확인을 해주세요.');
      return;
    }
    const param: SignupRequest = { nickname, email, password };
    await signupUser(param, {
      onSuccess: () => {
        Alert.alert('회원가입 완료', '로그인 해주세요.');
        stackNav.navigate('Login');
      },
      onError: (error: Error) => {
        Alert.alert('회원가입 실패', `${error.message}`);
      },
    });
  };

  // 닉네임 중복확인
  const { refetch: checkDuplicateNickname } = useCheckDuplicateNickname(nickname);
  const handleCheckDuplicateNickname = async () => {
    const isValidNickName = validate('nickname', nickname);
    if (!isValidNickName) {
      Alert.alert('닉네임 오류', '닉네임을 올바르게 입력해주세요.');
      return;
    }
    const { data, error, isError } = await checkDuplicateNickname();
    if (isError) {
      Alert.alert('중복확인 실패', error.message);
      return;
    }
    if (!data) {
      Alert.alert('중복확인 실패', '데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (data.isDuplicate) {
      Alert.alert('중복확인 완료', '이미 사용중인 닉네임입니다.');
      setIsNicknameChecked(false);
    } else {
      Alert.alert('중복확인 완료', '사용 가능한 닉네임입니다.');
      setIsNicknameChecked(true);
    }
  };

  return (
    <View style={styles.container}>
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
      >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  button: {
    backgroundColor: '#6A49E9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
