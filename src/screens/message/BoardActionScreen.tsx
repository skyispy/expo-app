import { useNavigation, useRoute } from '@react-navigation/native';
import { AppRouteScreenProps, AppStackScreenProps } from '@types';
import { useEffect, useState } from 'react';
import { CustomLoading } from '@components';
import { BoardActionList } from '@screens/message/components';

export const BoardActionScreen = () => {
  const route = useRoute<AppRouteScreenProps<'BoardAction'>>();
  const navigation = useNavigation<AppStackScreenProps>();
  const { actionType } = route.params;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if(actionType === 'view') {
      navigation.setOptions({ headerTitle: '최근에 본 게시물' });
    } else if(actionType === 'like') {
      navigation.setOptions({ headerTitle: '좋아요 누른 게시물' });
    } else if(actionType === 'hide') {
      navigation.setOptions({ headerTitle: '숨김 처리한 게시물' });
    }
  }, [actionType]);

  useEffect(() => {
    return navigation.addListener('transitionEnd', () => {
      setIsLoading(false);
    });
  }, [navigation]);

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <BoardActionList actionType={actionType} />
  );
}