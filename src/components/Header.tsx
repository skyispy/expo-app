import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackHeaderProps } from '@react-navigation/stack';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';

export const Header = ({ options }: StackHeaderProps | BottomTabHeaderProps) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { marginTop: top }]}>
      {options?.headerLeft ? options.headerLeft({ canGoBack: true }) : <View style={styles.side} />}
      <Text style={styles.title}>{options?.headerTitle as string}</Text>
      {options?.headerRight ? (
        options.headerRight({ canGoBack: true })
      ) : (
        <View style={styles.side} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    height: 50,
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
  },
});
