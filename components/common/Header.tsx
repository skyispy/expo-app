import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons/';
import { StackHeaderProps } from '@react-navigation/stack';

const headerConfig: Record<string, {
  title?: string;
  showBackButton?: boolean;
}> = {
  'Signup': {
    title: '회원가입',
    showBackButton: true,
  },
  'Login': {
    title: '로그인',
    showBackButton: false,
  },
  'Home': {
    title: '홈',
    showBackButton: false,
  },
  'Profile': {
    title: '프로필',
    showBackButton: false,
  }
}

export const Header = ({ headerProps }: {
  headerProps: StackHeaderProps
}) => {
  const { top } = useSafeAreaInsets();
  const page = headerProps.route.name;
  const config = headerConfig[page] || {};

  return (
    <View style={[styles.container, { marginTop: top }]}>
      {config.showBackButton ? (
        <TouchableOpacity
          style={styles.side}
          onPress={() => headerProps.navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <View style={styles.side} />
      )}
      <Text style={styles.title}>{config.title}</Text>
      <View style={styles.side} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFF',
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
});
