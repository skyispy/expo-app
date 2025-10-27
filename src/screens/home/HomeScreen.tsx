import { ScrollView, StyleSheet } from 'react-native';
import { EventBanner } from './components/EventBanner';

export const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <EventBanner />
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})