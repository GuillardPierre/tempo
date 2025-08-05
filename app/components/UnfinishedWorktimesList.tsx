import React from 'react';
import { WorktimeSeries, RecurrenceException } from '@/app/types/worktime';
import Block from './Block';
import MainWrapper from './MainWrapper';

interface UnfinishedWorktimesListProps {
	unfinishedWorktimes: WorktimeSeries[];
	currentDate: string;
	recurrenceExceptions: RecurrenceException[];
	setModalType: (type: 'menu' | 'update') => void;
	setModalVisible: (visible: boolean) => void;
	setSelectedWorktime: (worktime: WorktimeSeries) => void;
	setUnfinishedWorktimes: (worktimes: WorktimeSeries[]) => void;
	setWorktimes: (
		worktimes:
			| WorktimeSeries[]
			| ((prev: WorktimeSeries[]) => WorktimeSeries[])
	) => void;
	setSnackBar: (type: 'error' | 'info', messageText: string) => void;
}

export default function UnfinishedWorktimesList({
	unfinishedWorktimes,
	currentDate,
	recurrenceExceptions,
	setModalType,
	setModalVisible,
	setSelectedWorktime,
	setUnfinishedWorktimes,
	setWorktimes,
	setSnackBar,
}: UnfinishedWorktimesListProps) {
	if (unfinishedWorktimes.length === 0) {
		return null;
	}

	console.log('unfinishedWorktimes', unfinishedWorktimes);
	return (
		<>
			{unfinishedWorktimes.map((worktime) => (
				<Block
					key={`${worktime.id}-chrono`}
					worktime={worktime}
					setModalType={setModalType}
					setModalVisible={setModalVisible}
					setSelectedWorktime={setSelectedWorktime}
					setUnfinishedWorktimes={setUnfinishedWorktimes}
					setWorktimes={setWorktimes}
					setSnackBar={setSnackBar}
					currentDate={currentDate}
					recurrenceExceptions={recurrenceExceptions}
				/>
			))}
		</>
	);
}
