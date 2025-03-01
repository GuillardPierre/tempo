import React, { useState } from 'react';
import { View, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useThemeColors } from '../../hooks/useThemeColors';
import ThemedText from '../../components/utils/ThemedText';

type Props = {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
};

export default function TimePickerInput({ label, value, onChange }: Props) {
  const [show, setShow] = useState(false);
  const colors = useThemeColors();

  const onTimeChange = (_: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText style={[styles.label, { color: colors.secondaryText }]}>
          {label}
        </ThemedText>
      )}
      <Pressable
        onPress={() => setShow(true)}
        style={[
          styles.input,
          {
            backgroundColor: colors.primaryLight,
            borderColor: '#8955FD',
          },
        ]}
      >
        <ThemedText
          style={{
            color: colors.primaryText,
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {formatTime(value)}
        </ThemedText>
      </Pressable>

      {show && (
        <DateTimePicker
          value={value}
          mode='time'
          is24Hour={true}
          onChange={onTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  input: {
    width: '100%',
    borderWidth: 3,
    borderStyle: 'solid',
    borderRadius: 4,
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
