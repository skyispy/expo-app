import { StyleSheet, Text, View } from 'react-native';
import { FC } from 'react';
import { Board } from '../../types';
import { useGetCommentList } from '../../hooks';

type BoardCommentProps = {
  board: Board;
}

export const BoardComment: FC<BoardCommentProps> = ({ board }) => {
  const { commentList, commentFetchNextPage, commentRefetch } = useGetCommentList(board.boardId);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>댓글 {board.commentCount}</Text>
      </View>
      <View>
        {commentList && commentList.map((comment) => (
          <View key={comment.commentId} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{comment.user.nickname}</Text>
            <Text>{comment.content}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  }
})