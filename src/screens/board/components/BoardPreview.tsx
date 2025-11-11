import { AppStackScreenProps, Board, User } from '@types';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { ProfileImage } from '@components';
import { Ionicons } from '@expo/vector-icons/';
import { useAuthStore, useEllipsisModalStore } from '@store';
import { timeSince } from '@utils';
import { useBoardLike, useBoardMenuOptions } from '@hooks';

export const BoardPreview = ({ board }: { board: Board }) => {
  const navigation = useNavigation<AppStackScreenProps>()
  const user = useAuthStore((state) => state.user) as User;
  const { show: showEllipsisModal, setMenuOptions } = useEllipsisModalStore((state) => state);

  const boardMenuOptions = useBoardMenuOptions(board, user);
  const { boardLike } = useBoardLike();

  return (
    <Pressable
      onPress={() => navigation.navigate('Board', { boardId: board.boardId })}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <ProfileImage
            wrapperStyle={styles.profileImageContainer}
            uri={board.user.profileImageUrl}
            size={50}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.nickname}>{board.user.nickname}</Text>
            <Text style={styles.boardCreateDate}>
              {timeSince(board.createDate, board.updateDate)}
            </Text>
          </View>
        </View>
        <View style={styles.actionContainer}>
          {user?.userId !== board.user.userId && (
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>팔로우</Text>
            </TouchableOpacity>
          )}
          <Pressable
            style={{ marginHorizontal: 4 }}
            onPress={() => {
              setMenuOptions(boardMenuOptions);
              showEllipsisModal();
            }}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </Pressable>
        </View>
      </View>
      <View style={styles.main}>
        <View>
          <Text style={styles.title}>{board.title}</Text>
          <Text style={styles.content}>{board.content}</Text>
        </View>
        <View style={styles.thumbnailImageContainer}>
          <Image
            style={styles.thumbnailImage}
            source={board.thumbnailImageUrl ? { uri: board.thumbnailImageUrl } : null}
            placeholder={require('@assets/event2.png')}
            transition={300}
            contentFit="cover"
            cachePolicy={'disk'}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <View style={[styles.metaContainer, { flex: 0.3 }]}>
          <Ionicons name="eye-outline" size={24} color="black" />
          <Text style={styles.metaCount}>{board.views}</Text>
        </View>
        <Pressable style={[styles.metaContainer, { flex: 0.7, justifyContent: 'flex-end' }]}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
          <Text style={styles.metaCount}>{board.commentCount}</Text>
        </Pressable>
        <Pressable style={styles.metaContainer} onPress={() => boardLike({ boardId: board.boardId, isLiked: board.isLiked })}>
          <Ionicons name={board.isLiked ? 'heart' : 'heart-outline'} size={24} color={board.isLiked ? 'red' : 'black'} />
          <Text style={styles.metaCount}>{board.likes}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: '#999',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileContainer: {
    flex: 0.6,
    flexDirection: 'row',
  },
  profileImageContainer: {
    marginRight: 10
  },
  profileTextContainer: {
    height: '100%',
    paddingVertical: 6,
    justifyContent: 'space-between',
  },
  nickname: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  boardCreateDate: {
    fontSize: 12,
    color: '#666',
  },
  actionContainer: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  followButton: {
    minWidth: '18%',
    alignItems: 'center',
    marginRight: 8,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6A49E9',
    backgroundColor: '#fff',
  },
  followButtonText: {
    color: '#6A49E9',
  },
  main: {
    marginTop: 8,
    gap: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  content: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    lineHeight: 16,
  },
  thumbnailImageContainer: {
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 8,
  },
  metaCount: {
    fontSize: 16,
    color: '#666',
  }
})