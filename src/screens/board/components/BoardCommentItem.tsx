import { useCommentMenuOptions } from '@hooks';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProfileImage } from '@components';
import { timeSince } from '@utils';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useEllipsisModalStore } from '@store';
import { Comment, User } from '@types';

export const BoardCommentItem = ({ comment }: { comment: Comment }) => {
  const user = useAuthStore((state) => state.user) as User;
  const { show: showEllipsisModal, setMenuOptions } = useEllipsisModalStore((state) => state);
  const commentMenuOptions = useCommentMenuOptions(comment.user, user);
  return (
    <View key={comment.commentId} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <ProfileImage uri={comment.user.profileImageUrl} size={36} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.nickname}>{comment.user.nickname}</Text>
            <Text style={styles.commentDate}>{timeSince(comment.createDate, comment.updateDate)}</Text>
          </View>
        </View>
        <Pressable style={styles.ellipsisButton} onPress={() => {
          setMenuOptions(commentMenuOptions);
          showEllipsisModal();
        }}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </Pressable>
      </View>
      <View style={styles.main}>
        <Text>{comment.content}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileTextContainer: {
    height: '100%',
    paddingVertical: 4,
    gap: 4,
  },
  nickname: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
  },
  ellipsisButton: {
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    gap: 6,
    paddingLeft: 46,
  },
})