import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

// Ce composant englobe Block dans une View avec le même style d'encapsulation
// On peut passer des children ou le composant Block directement via props

type BlockWrapperProps = {
	children: React.ReactNode;
	backgroundColor?: string;
	style?: StyleProp<ViewStyle>;
	direction?: 'row' | 'column';
	fullHeight?: boolean;
};

export default function BlockWrapper({
	children,
	backgroundColor,
	style,
	direction = 'row',
	fullHeight = false,
}: BlockWrapperProps) {
	return (
		<View
			style={[
				styles.container,
				backgroundColor ? { backgroundColor } : {},
				{ flexDirection: direction },
				fullHeight ? { flex: 1 } : { height: 80, maxHeight: 80 },
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
