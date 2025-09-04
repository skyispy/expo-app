import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { SignStackScreenProps, } from '../../types';
import { useLoginUser } from '../../hooks';
import { UserLoginSchema } from '../../schemas';
import CheckBox from 'expo-checkbox'
import { useAuthStore } from '../../store/useAuthStore';

export const LoginScreen = () => {
  const stackNav = useNavigation<SignStackScreenProps>();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [keepLogin, setKeepLogin] = useState<boolean>(false);

  const { loginUser } = useLoginUser();
  const setUser = useAuthStore(state => state.setUser);

  const handleLogin = async () => {
    const param = { email, password, keepLogin };
    const result = UserLoginSchema.safeParse(param);
    if (!result.success) {
      Alert.alert('로그인 실패', result.error.message);
      return;
    }

    await loginUser(result.data, {
      onSuccess: (data) => {
        Alert.alert('로그인 성공', `${data?.user.nickname}님 환영합니다!`);
        setUser(data.user);
      },
      onError: (error: Error) => {
        Alert.alert('로그인 실패', `${error.message}`);
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { marginTop: 100 }]}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.keepLoginContainer}>
        <CheckBox
          value={keepLogin}
          onValueChange={setKeepLogin}
          color={keepLogin ? '#6A49E9' : undefined}
          style={styles.checkBox}
        />
        <Text style={styles.keepLoginText}>로그인 상태 유지</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>아이디 찾기</Text>
        <View style={styles.separator} />
        <Text style={styles.linkText}>비밀번호 찾기</Text>
        <View style={styles.separator} />
        <Text
          onPress={() => stackNav.navigate('Signup')}
          style={styles.linkText}
        >
          회원가입
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 40,
  },
  inputContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    marginTop: 8,
  },
  keepLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkBox: {
    marginRight: 8,
    width: 20,
    height: 20,
  },
  keepLoginText: {
    color: 'gray'
  },
  button: {
    backgroundColor: '#6A49E9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  linkText: {
    // color: '#6A49E9',
    color: 'gray',
    fontWeight: 'bold',
  },
  separator: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
});
