import React from 'react';
import { View, Pressable, Vibration } from 'react-native';
import { useThemeColors } from '@/app/hooks/useThemeColors';
import BlockWrapper from './BlockWrapper';
import ThemedText from './utils/ThemedText';
import BurgerMenuSvg from './svg/burgerMenu';
import { RecurrenceException } from '@/app/types/worktime';

interface ExceptionsListProps {
	exceptions: RecurrenceException[];
	date: string;
	onExceptionPress: (exception: RecurrenceException) => void;
}

const ExceptionsList = ({
	exceptions,
	date,
	onExceptionPress,
}: ExceptionsListProps) => {
	const colors = useThemeColors();

	const filteredExceptions = exceptions.filter((exception) => {
		const exceptionStart = new Date(exception.pauseStart);
		const exceptionEnd = new Date(exception.pauseEnd);
		exceptionEnd.setDate(exceptionEnd.getDate() + 1);
		const currentDate = new Date(date);
		return currentDate >= exceptionStart && currentDate <= exceptionEnd;
	});

	if (filteredExceptions.length === 0) return null;

	return (
		<>
			{filteredExceptions.map((exception) => (
				<BlockWrapper
					key={exception.id}
					backgroundColor={colors.primaryLight}
					style={{ marginBottom: 5 }}
				>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<View>
							<ThemedText variant='header2' color='primaryText'>
								Vacances / pause en cours
							</ThemedText>
							<ThemedText variant='body' color='primaryText'>
								Reposez-vous!
							</ThemedText>
						</View>
						<Pressable
							style={{
								alignItems: 'flex-end',
								marginLeft: 17,
							}}
							onPress={() => {
								Vibration.vibrate(50);
								onExceptionPress(exception);
							}}
						>
							<BurgerMenuSvg />
						</Pressable>
					</View>
				</BlockWrapper>
			))}
		</>
	);
};

export default ExceptionsList;
