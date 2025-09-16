import { Image, ImageStyle } from 'react-native';

type Props = {
  uri: string | null | undefined;
  style?: ImageStyle;
}

export const ProfileImage = ({ uri, style }: Props) => (
  <Image
    style={style}
    source={uri ? { uri } : require('@assets/user.png')}
  />
)