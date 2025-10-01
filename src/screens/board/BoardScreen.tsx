import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Board } from '../../types';
import { Image } from 'expo-image';

export const BoardScreen = () => {
  const route = useRoute();
  const { board } = route.params as { board: Board };
  return (
    <View style={styles.container}>
      <View style={styles.thumbnailContainer}>
        <Image style={styles.thumbnail} source={board.thumbnailImageUrl ? { uri: board.thumbnailImageUrl } : null} />
      </View>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{board.title}</Text>
        <Text style={{ fontSize: 16, color: '#666' }}>{board.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thumbnailContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'red',
  }
})