import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SortOrder } from '@types';

interface SortOrderPickerProps {
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

export const SortOrderPicker = ({ sortOrder, setSortOrder }: SortOrderPickerProps) => {
  return (
    <View style={styles.sortingHeader}>
      <Pressable
        style={
          sortOrder === 'latest'
            ? [styles.sortingContainer, { backgroundColor: '#A084E8', borderColor: '#A084E8' }]
            : styles.sortingContainer
        }
        onPress={() => setSortOrder('latest')}
      >
        <Text
          style={
            sortOrder === 'latest' ? [styles.sortingText, { color: '#fff' }] : styles.sortingText
          }
        >
          최신순
        </Text>
      </Pressable>
      <Pressable
        style={
          sortOrder === 'oldest'
            ? [styles.sortingContainer, { backgroundColor: '#A084E8', borderColor: '#A084E8' }]
            : styles.sortingContainer
        }
        onPress={() => setSortOrder('oldest')}
      >
        <Text
          style={
            sortOrder === 'oldest' ? [styles.sortingText, { color: '#fff' }] : styles.sortingText
          }
        >
          오래된 순
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sortingHeader: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },
  sortingContainer: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#6A49E9',
  },
  sortingText: {
    color: '#6A49E9',
    fontSize: 12,
  },
});