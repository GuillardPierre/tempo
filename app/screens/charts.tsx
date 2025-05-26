import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import MainWrapper from '../components/MainWrapper';
import ThemedText from '../components/utils/ThemedText';
import { LineChart, PieChart, StackedBarChart } from 'react-native-chart-kit';
import BlockWrapper from '../components/BlockWrapper';
import { SegmentedButtons } from 'react-native-paper';

const data = [
	{
		name: 'Classe',
		population: 18, // heures sur la période
		color: 'rgba(52, 152, 219, 1)',
		legendFontColor: '#7F7F7F',
		legendFontSize: 15,
	},
	{
		name: 'Préparations',
		population: 10,
		color: 'rgba(46, 204, 113, 1)',
		legendFontColor: '#7F7F7F',
		legendFontSize: 15,
	},
	{
		name: 'Corrections',
		population: 7,
		color: 'rgba(241, 196, 15, 1)',
		legendFontColor: '#7F7F7F',
		legendFontSize: 15,
	},
	{
		name: 'Réunions',
		population: 4,
		color: 'rgba(231, 76, 60, 1)',
		legendFontColor: '#7F7F7F',
		legendFontSize: 15,
	},
	{
		name: 'Autres',
		population: 3,
		color: 'rgba(155, 89, 182, 1)',
		legendFontColor: '#7F7F7F',
		legendFontSize: 15,
	},
];

const data2 = {
	labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
	datasets: [
		{
			data: [38, 42, 36, 45, 40, 39], // heures totales par mois
			color: (opacity = 0.5) => `#34495e`, // couleur de la courbe
			strokeWidth: 3,
		},
	],
	legend: ['Temps de travail total'], // optionnel
};

const data3 = {
	labels: ['Cat1', 'Cat2', 'TOTAL'],
	legend: ['temps actuel', 'temps estimé'],
	data: [
		[60, 60],
		[30, 30],
		[90, 90],
	],
	barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
};

const graphStyle = {
	borderRadius: 16,
	overflow: 'hidden',
	marginTop: 10,
};

const chartConfig = {
	backgroundGradientFrom: '#1E2923',
	backgroundGradientFromOpacity: 0,
	backgroundGradientTo: 'white',
	backgroundGradientToOpacity: 0.5,
	color: (opacity = 1) => `black`,
	strokeWidth: 1, // optional, default 3
	barPercentage: 0.5,
	useShadowColorFromDataset: false, // optional
};

export default function Charts() {
	const colors = useThemeColors();
	const screenWidth = Dimensions.get('window').width;
	const [value, setValue] = useState<string>('week');
	return (
		<>
			<SafeAreaView
				style={[
					styles.container,
					{
						backgroundColor: colors.primary,
					},
				]}
			>
				<StatusBar backgroundColor={colors.primary} barStyle='light-content' />
				<Header
					modalVisible={false}
					setModalVisible={() => {}}
					setModalType={() => {}}
				/>
				<View style={{ flex: 1, zIndex: 99999, overflow: 'hidden' }}>
					<MainWrapper style={styles.container}>
						<ThemedText variant='header1' color='secondaryText'>
							Statistiques
						</ThemedText>
						<SegmentedButtons
							value={value}
							onValueChange={setValue}
							density='regular'
							theme={{
								colors: {
									secondaryContainer: colors.primaryLight,
								},
							}}
							style={{
								borderWidth: 3,
								borderColor: '#3D348B',
								borderRadius: 30,
								backgroundColor: colors.background,
							}}
							buttons={[
								{
									// icon: () => <AddRoundSvg />,
									label: 'Semaine',
									value: 'week',
									checkedColor: colors.primaryText,
									uncheckedColor: colors.secondaryText,
								},
								{
									// icon: () => <ClockSvg />,
									label: 'Mois',
									value: 'month',
									checkedColor: colors.primaryText,
									uncheckedColor: colors.secondaryText,
								},
								{
									// icon: () => <AddRoundSvg />,
									label: 'Année',
									value: 'year',
									checkedColor: colors.primaryText,
									uncheckedColor: colors.secondaryText,
								},
							]}
						/>
						<BlockWrapper direction='column'>
							<ThemedText variant='header2' color='secondaryText'>
								Moyenne globale
							</ThemedText>
							<PieChart
								data={data}
								width={screenWidth - 40}
								height={245}
								chartConfig={chartConfig}
								accessor={'population'}
								backgroundColor={'transparent'}
								paddingLeft={'5'}
								center={[10, 0]}
							/>
						</BlockWrapper>
						<BlockWrapper direction='column'>
							<ThemedText variant='header2' color='secondaryText'>
								Temps de travail
							</ThemedText>
							<LineChart
								data={data2}
								width={screenWidth - 55}
								height={220}
								verticalLabelRotation={30}
								chartConfig={chartConfig}
								bezier
							/>
						</BlockWrapper>
						<BlockWrapper direction='column'>
							<ThemedText variant='header2' color='secondaryText'>
								Estimation à l'année
							</ThemedText>
							<StackedBarChart
								style={{ ...graphStyle, overflow: 'hidden' as 'hidden' }}
								data={data3}
								width={screenWidth - 55}
								height={220}
								chartConfig={chartConfig}
								hideLegend={false}
							/>
						</BlockWrapper>
					</MainWrapper>
				</View>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
