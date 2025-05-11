import React from 'react';
import { StyleSheet, View } from 'react-native';

// Ce composant englobe Block dans une View avec le même style d'encapsulation
// On peut passer des children ou le composant Block directement via props

type BlockWrapperProps = {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: object;
};

export default function BlockWrapper({ children, backgroundColor, style }: BlockWrapperProps) {
  return (
    <View
      style={[
        styles.container,
        backgroundColor ? { backgroundColor } : {},
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 4,
    borderColor: '#3D348B',
    paddingBlock: 5,
    paddingHorizontal: 10,
    marginBlock: 5,
  },
}); 