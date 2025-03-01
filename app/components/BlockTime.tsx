import { StyleSheet, View } from 'react-native';

import Block from './Block';
import ThemedText from './utils/ThemedText';

type Props = {
  startTime: string;
  endTime: string;
  activity: string;
  duration: string;
};

export default function BlockTime({
  startTime,
  endTime,
  activity,
  duration,
}: Props) {
  return (
    <View style={styles.container}>
      {/* <ThemedText variant='body' color='secondaryText' style={[styles.text]}>
        {startTime}
      </ThemedText> */}
      <Block
        startTime={startTime}
        endTime={endTime}
        type='time'
        text={activity}
        duration={duration}
      />
      {/* <ThemedText variant='body' color='secondaryText' style={[styles.text]}>
        {endTime}
      </ThemedText> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBlock: 5,
  },
  text: {
    paddingBlock: 2,
    marginBlock: 2,
    backgroundColor: '#C2B2FF',
    borderWidth: 2,
    borderColor: '#7B32F5',
    width: '18%',
    textAlign: 'center',
    borderRadius: 12,
  },
});
