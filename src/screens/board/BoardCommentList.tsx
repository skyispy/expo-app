import { StyleSheet, Text, View } from 'react-native';
import { Board } from '../../types';
import { useGetCommentList } from '../../hooks';
import { BoardCommentItem } from '@screens/board/BoardCommentItem';

export const BoardCommentList = ({ board }: { board: Board }) => {

  const { commentList, commentFetchNextPage, commentRefetch } = useGetCommentList('board', board.boardId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>댓글 {commentList?.length ?? 0}</Text>
      </View>
      <View>
        {commentList && commentList.map((comment) => (
          <BoardCommentItem key={comment.commentId} comment={comment} />
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
})