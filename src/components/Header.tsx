import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons/';
import { StackHeaderProps } from '@react-navigation/stack';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';

const headerConfig: Record<
  string,
  {
    title?: string;
    showBackButton?: boolean;
  }
> = {
  Signup: {
    title: '회원가입',
    showBackButton: true,
  },
  Login: {
    title: '로그인',
  },
  Home: {
    title: '홈',
  },
  Profile: {
    title: '프로필',
  },
  ProfileEdit: {
    title: '프로필 수정',
    showBackButton: true,
  },
  BoardList: {
    title: '게시판',
  },
  Board: {
    title: '게시글',
    showBackButton: true,
  },
  BoardEdit: {
    title: '게시글 작성',
    showBackButton: true,
  }
};

export const Header = ({
  navigation,
  route,
  options,
}: StackHeaderProps | BottomTabHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const config = headerConfig[route.name] || {};

  const renderLeft = () => {
    if (config.showBackButton) {
      return (
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
      );
    }
    return <View style={styles.side} />;
  };

  return (
    <View style={[styles.container, { marginTop: top }]}>
      {renderLeft()}
      <Text style={styles.title}>{config.title}</Text>
      {options?.headerRight ? options.headerRight({ canGoBack: true }) : <View style={styles.side} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    height: 46,
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  side: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  }
});
