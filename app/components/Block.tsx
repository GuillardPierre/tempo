import { StyleSheet, View, Pressable, Vibration } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import React from 'react';
import TrashIcon from './svg/trash';
import ThemedText from './utils/ThemedText';
import CustomChip from './utils/CustomChip';
import BurgerMenuSvg from './svg/burgerMenu';

type Props = {
	type: 'time' | 'button';
	text: string;
	duration: number;
	startTime: string;
	endTime: string;
	worktimeType: 'SINGLE' | 'RECCURING';
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
	worktimeType,
	setModalType,
	setModalVisible,
	setBlockToDelete,
}: Props) {
	const colors = useThemeColors();
	const convertTime = (time: string) => {
		const date = new Date(time);
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${hours}:${minutes}`;
	};

	const convertDuration = (duration: number) => {
		const hours = Math.floor(duration / 60);
		if (hours > 0) {
			return `${hours}:${duration % 60 < 10 ? '0' : ''}${duration % 60}`;
		} else {
			return `0:${duration % 60 < 10 ? '0' : ''}${duration}`;
		}
	};

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor:
						worktimeType === 'SINGLE' ? colors.primaryLight : '#f7a94a',
				},
			]}
		>
			{type === 'time' && (
				<View style={styles.timeContainer}>
					<ThemedText>{convertTime(startTime)}</ThemedText>
					<View style={styles.separator} />
					<ThemedText>{convertTime(endTime)}</ThemedText>
				</View>
			)}
			<ThemedText style={styles.mainText} variant='header2' color='primaryText'>
				{text}
			</ThemedText>
			{type === 'time' && (
				<>
					<CustomChip>{convertDuration(duration)}</CustomChip>
					<Pressable
						onPress={() => {
							Vibration.vibrate(50);
							setModalType('delete');
							setModalVisible(true);
							setBlockToDelete(0);
						}}
					>
						<BurgerMenuSvg />
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
