import { Platform, Dimensions } from 'react-native';

let { width } = Dimensions.get("window");

export const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
});
export const MAX_COMPOSER_HEIGHT = 150;
export const DEFAULT_PLACEHOLDER = 'Type a message...';
export const DATE_FORMAT = 'MMMM DD, YYYY';
export const TIME_FORMAT = 'h:mm A';




export const IMAGE_WIDTH = (width * 0.7);
export const IMAGE_HEIGHT = IMAGE_WIDTH;

export const BUBBLE_MAX_WIDTH = IMAGE_WIDTH + 10;
export const BUBBLE_MIN_HEIGHT = 20;