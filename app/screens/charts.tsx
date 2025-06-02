import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import Header from '../components/Header';
import MainWrapper from '../components/MainWrapper';
import ThemedText from '../components/utils/ThemedText';
import { LineChart, PieChart, StackedBarChart } from 'react-native-chart-kit';
import BlockWrapper from '../components/BlockWrapper';
import { SegmentedButtons } from 'react-native-paper';
import { httpGet } from '../components/utils/querySetup';
import ENDPOINTS from '../components/utils/ENDPOINT';
import {
  getCurrentWeekRange,
  getCurrentMonthRange,
  getCurrentSchoolYearRange,
} from '../utils/dateRanges';

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
  const [categoryTimeSpent, setCategoryTimeSpent] = useState<any>(null);
  const [lineChartData, setLineChartData] = useState<any>(null);

  const getCategoryTimeSpent = async (range: { from: string; to: string }) => {
    const url = `${
      ENDPOINTS.charts.root
    }?type=${value}&from=${encodeURIComponent(
      range.from
    )}&to=${encodeURIComponent(range.to)}`;
    console.log('url', url);
    const rep = await httpGet(url);
    if (rep.ok) {
      let data = await rep.json();
      if (data.error) {
        setLineChartData({
          labels: ['Chargement'],
          datasets: [
            { data: [0], color: (opacity = 0.5) => `#34495e`, strokeWidth: 3 },
          ],
          legend: ['Temps de travail total'],
        });
      } else {
        // console.log('data', data);
        if (Array.isArray(data.categories)) {
          const chartColors = [
            'rgba(52, 152, 219, 1)',
            'rgba(46, 204, 113, 1)',
            'rgba(241, 196, 15, 1)',
            'rgba(231, 76, 60, 1)',
            'rgba(155, 89, 182, 1)',
            'rgba(52, 73, 94, 1)',
            'rgba(26, 188, 156, 1)',
            'rgba(230, 126, 34, 1)',
            'rgba(149, 165, 166, 1)',
            'rgba(243, 156, 18, 1)',
          ];
          const legendFontColor = '#7F7F7F';
          const legendFontSize = 15;
          const pieData = data.categories.map((entry: any, idx: number) => ({
            name: entry.name || `Catégorie ${idx + 1}`,
            population: Number(entry.duration) || 0,
            color: chartColors[idx % chartColors.length],
            legendFontColor,
            legendFontSize,
          }));
          setCategoryTimeSpent(pieData);
        }
        // Pour le LineChart (total)
        if (
          data.total &&
          Array.isArray(data?.total?.data) &&
          Array.isArray(data?.total?.labels)
        ) {
          // Conversion des minutes en heures
          const dataInHours = data.total.data.map((v: number) =>
            typeof v === 'number' && isFinite(v) ? v / 60 : v
          );
          setLineChartData({
            labels: data.total.labels,
            datasets: [
              {
                data: dataInHours,
                color: (opacity = 0.5) => `#34495e`,
                strokeWidth: 3,
              },
            ],
            legend: ['Temps de travail total (heures)'],
          });
        }
      }
    }
  };

  useEffect(() => {
    let range;
    if (value === 'week') {
      range = getCurrentWeekRange();
    } else if (value === 'month') {
      range = getCurrentMonthRange();
    } else if (value === 'year') {
      range = getCurrentSchoolYearRange();
    }
    if (range) {
      getCategoryTimeSpent(range);
    }
  }, [value]);

  // Sécurisation des données pour le LineChart
  const safeLineChartData =
    lineChartData &&
    Array.isArray(lineChartData.labels) &&
    Array.isArray(lineChartData.datasets)
      ? {
          ...lineChartData,
          datasets: lineChartData.datasets.map((ds: any) => ({
            ...ds,
            data: Array.isArray(ds.data)
              ? ds.data.map((v: any) =>
                  typeof v === 'number' && isFinite(v) ? v : 0
                )
              : [],
          })),
        }
      : {
          labels: ['Chargement'],
          datasets: [
            {
              data: [0], // heures totales par mois
              color: (opacity = 0.5) => `#34495e`, // couleur de la courbe
              strokeWidth: 3,
            },
          ],
          legend: ['Temps de travail total'], // optionnel
        };

  // Sécurisation des données pour le PieChart
  const safePieChartData = Array.isArray(categoryTimeSpent)
    ? categoryTimeSpent.map((item: any) => ({
        ...item,
        population:
          typeof item.population === 'number' && isFinite(item.population)
            ? item.population
            : 0,
      }))
    : [];

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
                  label: 'Semaine',
                  value: 'week',
                  checkedColor: colors.primaryText,
                  uncheckedColor: colors.secondaryText,
                },
                {
                  label: 'Mois',
                  value: 'month',
                  checkedColor: colors.primaryText,
                  uncheckedColor: colors.secondaryText,
                },
                {
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
                data={safePieChartData}
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
                data={safeLineChartData}
                width={screenWidth - 55}
                height={255}
                verticalLabelRotation={20}
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
