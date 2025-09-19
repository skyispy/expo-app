import { ScrollView } from 'react-native';
import { EventBanner } from './EventBanner';

export const HomeScreen = () => {
  return (
    <ScrollView>
      <EventBanner />
    </ScrollView>
  );
};
