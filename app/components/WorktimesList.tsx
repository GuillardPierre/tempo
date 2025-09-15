import React from 'react';
import { View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import BlockWrapper from './BlockWrapper';
import ThemedText from './utils/ThemedText';
import Block from './Block';
import RoundButton from './utils/RoundButton';
import { isInInterval } from './utils/utils';
import { WorktimeSeries, RecurrenceException } from '../types/worktime';

interface WorktimesListProps {
	worktimes: WorktimeSeries[];
	currentDate: string;
	recurrenceExceptions: RecurrenceException[];
	setModalType: (type: 'menu' | 'update') => void;
	setModalVisible: (visible: boolean) => void;
	setSelectedWorktime: (worktime: WorktimeSeries) => void;
	setWorktimes?: (worktimes: WorktimeSeries[]) => void;
	onAddPress?: () => void;
}

const WorktimesList = ({
	worktimes,
	currentDate,
	recurrenceExceptions,
	setModalType,
	setModalVisible,
	setSelectedWorktime,
	setWorktimes,
	onAddPress,
}: WorktimesListProps) => {
	const colors = useThemeColors();
	const visibleWorktimes = worktimes.filter((worktime) => worktime.endHour !== null);
	const hasApplicableException = recurrenceExceptions.some((e) =>
		isInInterval(currentDate, e.pauseStart, e.pauseEnd)
	);

	if (visibleWorktimes.length === 0 && !hasApplicableException) {
		return (
			<BlockWrapper>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<ThemedText variant='body' color='secondaryText'>
						Rien de prévu pour ce jour-ci !{' '}
					</ThemedText>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							flexWrap: 'wrap',
						}}
					>
						<ThemedText variant='body' color='secondaryText'>
							Reposez-vous ou appuyez sur
						</ThemedText>
						<View style={{ marginHorizontal: 4 }}>
							<RoundButton
								onPress={onAddPress || (() => {})}
								svgSize={12}
								type='add'
								variant='secondary'
								btnSize={25}
							/>
						</View>
						<ThemedText variant='body' color='secondaryText'>
							pour enregistrer une activité
						</ThemedText>
					</View>
				</View>
			</BlockWrapper>
		);
	}

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			{visibleWorktimes.map((worktime) => (
					<Block
						key={`${worktime.type}-${worktime.id}`}
						worktime={worktime}
						currentDate={currentDate}
						recurrenceExceptions={recurrenceExceptions}
						setModalType={setModalType}
						setModalVisible={setModalVisible}
						setSelectedWorktime={setSelectedWorktime}
						setWorktimes={setWorktimes}
					/>
				))}
		</View>
	);
};

export default WorktimesList;
