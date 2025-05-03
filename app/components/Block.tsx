import { StyleSheet, View, Pressable, Vibration } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import React from 'react';
import ThemedText from './utils/ThemedText';
import CustomChip from './utils/CustomChip';
import BurgerMenuSvg from './svg/burgerMenu';
import { Worktime } from '../types/worktime';

type Props = {
	worktime: Worktime;
	type: 'time' | 'button';
	text: string;
	duration: number;
	startTime: string;
	endTime: string;
	worktimeType: 'SINGLE' | 'RECURRING';
	setModalType: (type: 'menu' | 'update') => void;
	setModalVisible: (visible: boolean) => void;
	setSelectedWorktime: (worktime: any) => void;
};

export default function Block({
	worktime,
	type,
	text,
	duration,
	startTime,
	endTime,
	worktimeType,
	setModalType,
	setModalVisible,
	setSelectedWorktime,
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

	const categoryName = worktime.categoryName || worktime.category?.name || '';
	const categoryColor =
		worktimeType === 'SINGLE' ? colors.primaryLight : '#f7a94a';

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: categoryColor,
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
				{categoryName}
			</ThemedText>
			{type === 'time' && (
				<>
					<CustomChip>{convertDuration(duration)}</CustomChip>
					<Pressable
						onPress={() => {
							Vibration.vibrate(50);
							setModalType('update');
							setModalVisible(true);
							setSelectedWorktime(worktime);
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
