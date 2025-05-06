import { StyleSheet, View, Pressable, Vibration } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import React from 'react';
import ThemedText from './utils/ThemedText';
import CustomChip from './utils/CustomChip';
import BurgerMenuSvg from './svg/burgerMenu';
import { Worktime } from '../types/worktime';
import StopSvg from './svg/stop';
import { httpPut } from './utils/querySetup';
import ENDPOINTS from './utils/ENDPOINT';

type Props = {
	worktime: Worktime;
	setModalType: (type: 'menu' | 'update') => void;
	setModalVisible: (visible: boolean) => void;
	setSelectedWorktime: (worktime: any) => void;
};

export default function Block({
	worktime,
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
		worktime.type === 'SINGLE' ? colors.primaryLight : '#f7a94a';

	const stopWorktime = async () => {
		const newData = {
			...worktime,
			endTime: new Date(),
			category: { id: worktime.categoryId, title: worktime.categoryName },
		};
		const rep = await httpPut(
			`${ENDPOINTS.worktime.root}${worktime.id}`,
			newData
		);
		if (rep.ok) {
			const data = await rep.json();
			console.log('data', data);
		} else {
			console.log('error', rep);
		}
	};

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: categoryColor,
				},
			]}
		>
			<View style={styles.timeContainer}>
				<ThemedText>{convertTime(worktime.startTime)}</ThemedText>
				<View style={styles.separator} />
				<ThemedText>
					{worktime.endTime ? convertTime(worktime.endTime) : '-'}
				</ThemedText>
			</View>
			<ThemedText style={styles.mainText} variant='header2' color='primaryText'>
				{categoryName} {!worktime.endTime ? '- En cours...' : ''}
			</ThemedText>
			<>
				<CustomChip>{convertDuration(worktime.duration)}</CustomChip>
				{worktime.endTime !== null ? (
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
				) : (
					<Pressable
						onPress={() => {
							Vibration.vibrate(50);
							stopWorktime();
						}}
					>
						<StopSvg />
					</Pressable>
				)}
			</>
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
