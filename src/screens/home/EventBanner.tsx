import { FlatList, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useGetBoards } from '../../hooks';
import { useNavigation } from '@react-navigation/native';
import { AppStackScreenProps } from '../../types';

export const EventBanner = () => {
  const { boards, isBoardsLoading } = useGetBoards('event');
  const navigation = useNavigation<AppStackScreenProps>();

  return (
    <View style={styles.container}>
      {boards && (
        <FlatList
          style={{ width: '100%', borderWidth: 1, borderColor: 'red' }}
          data={boards}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.boardId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() =>
                navigation?.navigate('Board', { board: item } )
              }
            >
              <Image
                source={item.imageUrl ? { uri: item.imageUrl } : require('@assets/event2.png')}
                style={{ flex: 1, borderWidth: 1 }}
                contentFit="contain"
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    width: width ,
    height: 200,
  }
})