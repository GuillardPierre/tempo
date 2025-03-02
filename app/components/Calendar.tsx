import { Fragment } from 'react';
import { StyleSheet } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { useCalendar } from '../hooks/useCalendar';

type Props = {
	date: string;
	setDate: (date: string) => void;
};

export default function Calendar({ date, setDate }: Props) {
	const { currentMonth, setCurrentMonth, onDayPress, marked } = useCalendar(
		date,
		setDate
	);

	return (
		<Fragment>
			<RNCalendar
				enableSwipeMonths
				current={date}
				style={styles.calendar}
				onDayPress={onDayPress}
				markedDates={marked}
				locale={'fr'}
				firstDay={1}
			/>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	calendar: {
		marginBottom: 0,
	},
});
