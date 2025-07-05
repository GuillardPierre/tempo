import React from 'react';
import { View } from 'react-native';
import { useThemeColors } from '@/app/hooks/useThemeColors';
import BlockWrapper from './BlockWrapper';
import ThemedText from './utils/ThemedText';
import Block from './Block';
import RoundButton from './utils/RoundButton';
import { WorktimeSeries, RecurrenceException } from '@/app/types/worktime';

interface WorktimesListProps {
	worktimes: WorktimeSeries[];
	currentDate: string;
	recurrenceExceptions: RecurrenceException[];
	setModalType: (type: 'menu' | 'update') => void;
	setModalVisible: (visible: boolean) => void;
	setSelectedWorktime: (worktime: WorktimeSeries) => void;
}

const WorktimesList = ({
	worktimes,
	currentDate,
	recurrenceExceptions,
	setModalType,
	setModalVisible,
	setSelectedWorktime,
}: WorktimesListProps) => {
	const colors = useThemeColors();

	if (worktimes.length === 0) {
		return (
			<BlockWrapper backgroundColor={colors.primaryLight}>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<ThemedText variant='body' color='primaryText'>
						Rien de prévu pour ce jour-ci !{' '}
					</ThemedText>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							flexWrap: 'wrap',
						}}
					>
						<ThemedText variant='body' color='primaryText'>
							Reposez-vous ou appuyez sur
						</ThemedText>
						<View style={{ marginHorizontal: 4 }}>
							<RoundButton
								onPress={() => {}}
								svgSize={12}
								type='add'
								variant='secondary'
								btnSize={25}
							/>
						</View>
						<ThemedText variant='body' color='primaryText'>
							pour enregistrer une activité
						</ThemedText>
					</View>
				</View>
			</BlockWrapper>
		);
	}

	return (
		<View style={{ marginTop: 'auto' }}>
			{worktimes
				.filter((worktime) => worktime.endTime !== null)
				.map((worktime) => (
					<Block
						key={`${worktime.type}-${worktime.id}`}
						worktime={worktime}
						currentDate={currentDate}
						recurrenceExceptions={recurrenceExceptions}
						setModalType={setModalType}
						setModalVisible={setModalVisible}
						setSelectedWorktime={setSelectedWorktime}
					/>
				))}
		</View>
	);
};

export default WorktimesList;
