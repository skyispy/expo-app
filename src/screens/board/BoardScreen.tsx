import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppStackScreenProps, Board, User } from '../../types';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons/';
import { ProfileImage } from '../../components';
import { useAuthStore, useEllipsisModalStore } from '../../store';
import { useEffect } from 'react';
import { EllipsisModal } from '../../components/EllipsisModal';
import { getMenuOptions } from '../../utils';

export const BoardScreen = () => {
  const route = useRoute();
  const { board } = route.params as { board: Board };
  const user = useAuthStore((state) => state.user) as User;
  const { show: showEllipsisModal, setMenuOptions } = useEllipsisModalStore((state) => state);

  const navigation = useNavigation<AppStackScreenProps>();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 16 }} onPress={showEllipsisModal}>
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </TouchableOpacity>
      ),
    })
  }, [])

  useEffect(() => {
    const menuOptions = getMenuOptions(board, user, navigation);
    setMenuOptions(menuOptions);
  }, [board, user]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ gap: 12 }}
    >
      <View style={{ gap: 20, backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{board.title}</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <Ionicons name='alarm' size={24} color="black" />
            <Text style={{ fontSize: 14, color: '#666' }}>{new Date(board.createDate).toLocaleDateString()}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <Ionicons name='eye' size={24} color="black" />
            <Text style={{ fontSize: 14, color: '#666' }}>{board.views}</Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 20, backgroundColor: '#efefef', paddingVertical: 10 }}>
          <View style={{ flex: 0.7, flexDirection: 'row', height: '100%', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <ProfileImage uri={board.user.profileImageUrl} size={50} />
            <View style={{ flexDirection: 'column', gap: 4 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{board.user.nickname}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{board.user.introduction}</Text>
            </View>
          </View>
          <View style={styles.actionContainer}>
            {user.userId !== board.user.userId && (
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>팔로우</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.thumbnailContainer}>
          <Image
            style={styles.thumbnail}
            source={{ uri: board.thumbnailImageUrl || undefined }}
            placeholder={require('@assets/event2.png')}
            transition={300}
            contentFit={'cover'}
            cachePolicy={"disk"}
          />
        </View>
        <Text style={{ fontSize: 18, lineHeight: 24, color: '#333' }}>{board.content}</Text>
        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="heart-outline" size={24} color="black" />
            <Text>{board.likes}</Text>
          </View>
        </View>
      </View>
      <EllipsisModal />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    flexDirection: 'column'
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#f5f5f5',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  actionContainer: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  followButton: {
    minWidth: '18%',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6A49E9',
    backgroundColor: '#fff',
  },
  followButtonText: {
    color: '#6A49E9',
  },
})