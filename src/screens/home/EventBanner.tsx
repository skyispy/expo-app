import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import { useGetBoards } from '../../hooks';
import { AppStackScreenProps } from '../../types';

const { width } = Dimensions.get('window');

export const EventBanner = () => {
  const { boards, isBoardsLoading } = useGetBoards('event');
  const navigation = useNavigation<AppStackScreenProps>();

  return (
    <View style={styles.container}>
      {boards && (
        <Carousel
          width={width * 0.9}
          height={100}
          data={boards}
          autoPlay={true}
          autoPlayInterval={10000}
          loop
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Pressable
                style={styles.itemImageContainer}
                onPress={() =>
                  navigation?.navigate('Board', { board: item } )
                }
              >
                <Image
                  source={item.thumbnailImageUrl ? { uri: item.thumbnailImageUrl } : require('@assets/event2.png')}
                  style={styles.itemImage}
                  contentFit="cover"
                />
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    flex: 1,
  }
})