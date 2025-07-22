import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

type Props = {
	open: boolean;
	setOpen: (b: boolean) => void;
	message: string;
	color: string;
};

export default function CustomSnackBar({
	open,
	setOpen,
	message,
	color,
}: Props) {
	const closeSnackBar = () => setOpen(false);

	// Ajout d'un effet pour fermer automatiquement la snackbar après 3 secondes
	useEffect(() => {
		if (open) {
			const timer = setTimeout(() => {
				setOpen(false);
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [open, setOpen]);

	return (
		<Snackbar
			visible={open}
			onDismiss={closeSnackBar}
			style={[styles.snackbar, { backgroundColor: color || '#333333' }]}
			wrapperStyle={styles.wrapper}
			action={{
				label: 'OK',
				onPress: closeSnackBar,
			}}
		>
			{message}
		</Snackbar>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		position: 'absolute',
		top: 50,
		left: 0,
		right: 0,
	},
	snackbar: {
		width: '90%',
		elevation: 6,
		marginHorizontal: 'auto',
		borderRadius: 16,
	},
});
