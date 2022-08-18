import Toast from 'react-native-toast-message';

export const showToast = (heading: string, message?: string) => {
  return Toast.show({
    text1: heading,
    text2: message,
    position: 'bottom',
    type: 'info',
    props: {
      text1NumberOfLines: 1
    }
  });
};

export const showToastError = (heading: string, message?: string) => {
  return Toast.show({
    text1: heading,
    text2: message,
    position: 'bottom',
    type: 'error',
    props: {
      text1Style: {
        borderColor: '#9B9B9B',
        borderWidth: 1,
      }
    }
  });
};
