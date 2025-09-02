import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SignStackScreenProps, SignupRequest } from '../../types';
import { useSignupUser } from '../../hooks';
import { UserSignupSchema } from '../../schemas';
import type { UserSignupFields } from '../../schemas';

export const SignupScreen = () => {
  const stackNav = useNavigation<SignStackScreenProps>();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<UserSignupFields>({});

  // zod schema 검증 함수
  const validate = (fieldName: keyof UserSignupFields, value: string) => {
    let errorMessage = '';

    // 1. Zod 스키마의 해당 필드 검증
    const filedSchema = UserSignupSchema.shape[fieldName];
    const result = filedSchema.safeParse(value);
    if (!result.success) {
      errorMessage = result.error.issues[0].message;
    }

    // 2. 비밀번호 확인 추가 검증
    if(fieldName === 'confirmPassword' && value !== password) {
      errorMessage = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage,
    }))
  }

  const hasError = Object.values(errors).some(v => !!v) || !username || !email || !password || !confirmPassword;

  const { signupUser } = useSignupUser();
  const handleSignup = async () => {

    const param: SignupRequest = { username, email, password };

    await signupUser(param, {
      onSuccess: () => {
        Alert.alert('회원가입 완료', '로그인 해주세요.');
        stackNav.navigate('Login');
      },
      onError: (error: Error) => {
        Alert.alert('회원가입 실패', `${error.message}`);
      },
    })
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={[styles.inputContainer, { marginTop: 100 }]}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={text => {
              setUsername(text);
              validate('username', text);
            }}
          />
          <View style={styles.errorContainer}>
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </View>
        </View>
        <View style={[styles.inputContainer]}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={text => {
              setEmail(text);
              validate('email', text);
            }}
          />
          <View style={styles.errorContainer}>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={password}
            onChangeText={text => {
              setPassword(text);
              validate('password', text);
            }}
          />
          <View style={styles.errorContainer}>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              validate('confirmPassword', text);
            }}
          />
          <View style={styles.errorContainer}>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>
        </View>
        <TouchableOpacity
          style={hasError ? [styles.button, { backgroundColor: 'gray' }] : styles.button}
          disabled={hasError}
          onPress={handleSignup}
        >
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 40,
  },
  inputContainer: {
    width: '100%',
    // marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    marginTop: 8,
  },
  errorContainer: {
    minHeight: 30,
  },
  errorText: {
    color: 'red',
    marginTop: 2,
    fontSize: 12
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