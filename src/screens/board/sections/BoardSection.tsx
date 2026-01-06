import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { timeSince } from '@utils';
import { ProfileImage } from '@components';
import { Image } from 'expo-image';
import { useBoardLike } from '@hooks';
import { useAuthStore } from '@store';
import { Board, User } from '@types';
import { useQueryClient } from '@tanstack/react-query';

export const BoardSection = ({ boardId }: { boardId: number }) => {
  const queryClient = useQueryClient();
  const board = queryClient.getQueryData<Board>(['board', { boardId }]);

  const user = useAuthStore((state) => state.user) as User;
  const { boardLike } = useBoardLike();

  if (!board) {
    return (
      <View style={styles.container}>
        <Text>게시글 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{board.title}</Text>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={18} color="gray" />
          <Text style={{ fontSize: 14, color: '#666' }}>
            {timeSince(board.createDate, board.updateDate)}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="eye" size={18} color="gray" />
          <Text style={{ fontSize: 14, color: '#666' }}>{board.views}</Text>
        </View>
      </View>
      <View style={styles.userContainer}>
        <View style={styles.userProfile}>
          <ProfileImage uri={board.user.profileImageUrl} size={50} />
          <View style={styles.userInfo}>
            <Text style={styles.userNickname}>{board.user.nickname}</Text>
            <Text style={styles.userIntro}>{board.user.introduction}</Text>
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
          cachePolicy={'disk'}
        />
      </View>
      <Text style={styles.content}>{board.content}</Text>
      <Pressable
        style={styles.metaContainer}
        onPress={() => {
          return boardLike({
            boardId: board.boardId,
            isLiked: board.isLiked,
            categoryId: board.category.categoryId,
          });
        }}
      >
        <Ionicons
          name={board.isLiked ? 'heart' : 'heart-outline'}
          size={24}
          color={board.isLiked ? 'red' : 'black'}
        />
        <Text style={styles.metaCount}>{board.likes}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 12,
  },
  userContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '#efefef',
    paddingVertical: 10,
  },
  userProfile: {
    flex: 0.7,
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'column',
    gap: 4,
  },
  userNickname: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userIntro: {
    fontSize: 14,
    color: '#666',
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
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#f5f5f5',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
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
  },
});
