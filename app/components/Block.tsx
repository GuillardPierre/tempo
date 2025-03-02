import { StyleSheet, View, Pressable, Vibration } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import React from 'react';
import TrashIcon from './svg/trash';
import ThemedText from './utils/ThemedText';
import CustomChip from './utils/CustomChip';

type Props = {
	type: 'time' | 'button';
	text: string;
	duration?: string;
	startTime?: string;
	endTime?: string;
	setModalType: (type: 'menu' | 'delete') => void;
	setModalVisible: (visible: boolean) => void;
	setBlockToDelete: (block: number) => void;
};

export default function Block({
	type,
	text,
	duration,
	startTime,
	endTime,
	setModalType,
	setModalVisible,
	setBlockToDelete,
}: Props) {
	const colors = useThemeColors();
	return (
		<View style={[styles.container, { backgroundColor: colors.primaryLight }]}>
			{type === 'time' && (
				<View style={styles.timeContainer}>
					<ThemedText>{startTime}</ThemedText>
					<View style={styles.separator} />
					<ThemedText>{endTime}</ThemedText>
				</View>
			)}
			<ThemedText style={styles.mainText} variant='header2' color='primaryText'>
				{text}
			</ThemedText>
			{type === 'time' && (
				<>
					<CustomChip>{duration}</CustomChip>
					<Pressable
						onPress={() => {
							Vibration.vibrate(50);
							setModalType('delete');
							setModalVisible(true);
							setBlockToDelete(0);
						}}
					>
						<TrashIcon />
					</Pressable>
				</>
			)}
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
		borderColor: '#8955FD',
		paddingBlock: 5,
		paddingHorizontal: 10,
		marginBlock: 5,
	},
	timeContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	separator: {
		height: 2,
		width: '100%',
		backgroundColor: '#FFF',
	},
	mainText: {
		width: 150,
	},
});
