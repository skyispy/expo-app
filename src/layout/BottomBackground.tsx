import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BottomBackground = ({ backgroundColor = '#fff' }: { backgroundColor?: string }) => {
  const { bottom } = useSafeAreaInsets();
  return <View style={[styles.background, { backgroundColor, height: bottom }]} />;
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
