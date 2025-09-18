import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Board } from '../../types';

export const BoardScreen = () => {
  const route = useRoute();
  const { board } = route.params as { board: Board };
  return (
    <View>
      <Text>{board.title} Screen</Text>
    </View>
  );
}