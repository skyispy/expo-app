import { View, StyleSheet } from 'react-native';
import { MessageMenuSection, UserActionSection } from '@screens/message/sections';

export const MessageScreen = () => {
  return (
    <View style={styles.container}>
      <UserActionSection />
      <MessageMenuSection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
});
