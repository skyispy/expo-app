import { ScrollView } from 'react-native';
import { EventBanner } from '@components/home';

export const HomeScreen = () => {
  return (
    <ScrollView>
      <EventBanner />
    </ScrollView>
  );
};
