import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import Header from "../components/Header";
import MainWrapper from "../components/MainWrapper";
import ThemedText from "../components/utils/ThemedText";
import { LineChart, PieChart } from "react-native-chart-kit";
import BlockWrapper from "../components/BlockWrapper";
import { SegmentedButtons } from "react-native-paper";
import { httpGet } from "../components/utils/querySetup";
import ENDPOINTS from "../components/utils/ENDPOINT";
import {
  getCurrentWeekRange,
  getCurrentMonthRange,
  getCurrentSchoolYearRange,
} from "../utils/dateRanges";
import { formatDuration } from "../utils/dateFormatters";
import type { ModalType } from "../types/modal";
import ModalMenu from "../components/Modal";
import Menu from "../components/ModalComponents/Menu";
import ProtectedRoute from "../components/utils/ProtectedRoute";

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "white",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `black`,
  strokeWidth: 1, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
  labelColor: (opacity = 1) => `black`,
  propsForLabels: {
    fontWeight: "bold",
  },
};

// Ajout de la fonction utilitaire pour filtrer les bords à zéro
function filterEdgeZeros(lineChartData: any, shouldFilter: boolean = true) {
  if (
    !shouldFilter ||
    !lineChartData ||
    !Array.isArray(lineChartData.labels) ||
    !Array.isArray(lineChartData.datasets) ||
    !Array.isArray(lineChartData.datasets[0]?.data)
  ) {
    return lineChartData;
  }

  let { labels } = lineChartData;
  let { data, ...restDataset } = lineChartData.datasets[0];

  // Filtrage du début
  if (data.length > 1 && data[0] === 0) {
    data = data.slice(1);
    labels = labels.slice(1);
  }
  // Filtrage de la fin
  if (data.length > 1 && data[data.length - 1] === 0) {
    data = data.slice(0, -1);
    labels = labels.slice(0, -1);
  }

  return {
    ...lineChartData,
    labels,
    datasets: [{ ...restDataset, data }],
  };
}

export default function Charts() {
  const colors = useThemeColors();
  const screenWidth = Dimensions.get("window").width;
  const [value, setValue] = useState<string>("week");
  const [categoryTimeSpent, setCategoryTimeSpent] = useState<any>(null);
  const [lineChartData, setLineChartData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>("menu");

  const getCategoryTimeSpent = async (range: { from: string; to: string }) => {
    const url = `${
      ENDPOINTS.charts.root
    }?type=${value}&from=${encodeURIComponent(
      range.from
    )}&to=${encodeURIComponent(range.to)}`;
    const rep = await httpGet(url);
    if (rep.ok) {
      let data = await rep.json();
      if (data.error) {
        setLineChartData({
          labels: ["Chargement"],
          datasets: [
            {
              data: [0],
              color: (opacity = 0.5) => `#34495e`,
              strokeWidth: 3,
            },
          ],
          // legend: ['Temps de travail total'],
        });
      } else {
        if (Array.isArray(data.categories)) {
          const chartColors = [
            "rgba(52, 152, 219, 1)",
            "rgba(46, 204, 113, 1)",
            "rgba(241, 196, 15, 1)",
            "rgba(231, 76, 60, 1)",
            "rgba(155, 89, 182, 1)",
            "rgba(52, 73, 94, 1)",
            "rgba(26, 188, 156, 1)",
            "rgba(230, 126, 34, 1)",
            "rgba(149, 165, 166, 1)",
            "rgba(243, 156, 18, 1)",
          ];
          const legendFontColor = "#7F7F7F";
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
            typeof v === "number" && isFinite(v) ? v / 60 : v
          );
          setLineChartData(
            filterEdgeZeros(
              {
                labels: data.total.labels,
                datasets: [
                  {
                    data: dataInHours,
                    color: (opacity = 0.5) => `#34495e`,
                    strokeWidth: 3,
                  },
                ],
                // legend: ['Temps de travail total (heures)'],
              },
              value === "month"
            ) // Ne filtrer les zéros qu'en mode mois
          );
        }
      }
    }
  };

  useEffect(() => {
    let range;
    if (value === "week") {
      range = getCurrentWeekRange();
    } else if (value === "month") {
      range = getCurrentMonthRange();
    } else if (value === "year") {
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
                  typeof v === "number" && isFinite(v) ? v : 0
                )
              : [],
          })),
        }
      : {
          labels: ["Chargement"],
          datasets: [
            {
              data: [0], // heures totales par mois
              color: (opacity = 0.5) => `#34495e`, // couleur de la courbe
              strokeWidth: 3,
            },
          ],
          legend: ["Temps de travail total"], // optionnel
        };

  // Sécurisation des données pour le PieChart
  const safePieChartData = Array.isArray(categoryTimeSpent)
    ? categoryTimeSpent.map((item: any) => ({
        ...item,
        population:
          typeof item.population === "number" && isFinite(item.population)
            ? item.population
            : 0,
      }))
    : [];

  return (
    <ProtectedRoute>
      <>
        <SafeAreaView
          style={[
            styles.container,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <StatusBar
            backgroundColor={colors.primary}
            barStyle="light-content"
          />
          <Header
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setModalType={setModalType}
          />
          <View style={{ flex: 1, overflow: "hidden" }}>
            <MainWrapper style={styles.container}>
              <ThemedText
                variant="header1"
                color="secondaryText"
                style={{ marginBottom: 10 }}
              >
                Statistiques
              </ThemedText>
              <SegmentedButtons
                value={value}
                onValueChange={setValue}
                density="regular"
                theme={{
                  colors: {
                    secondaryContainer: colors.primaryLight,
                  },
                }}
                style={{
                  borderWidth: 3,
                  borderColor: "#3D348B",
                  borderRadius: 30,
                  backgroundColor: colors.background,
                }}
                buttons={[
                  {
                    label: "Semaine",
                    value: "week",
                    checkedColor: colors.primaryText,
                    uncheckedColor: colors.secondaryText,
                  },
                  {
                    label: "Mois",
                    value: "month",
                    checkedColor: colors.primaryText,
                    uncheckedColor: colors.secondaryText,
                  },
                  {
                    label: "Année",
                    value: "year",
                    checkedColor: colors.primaryText,
                    uncheckedColor: colors.secondaryText,
                  },
                ]}
              />
              <BlockWrapper direction="column" fullHeight={true}>
                <ThemedText variant="header2" color="secondaryText">
                  Répartition globale
                </ThemedText>
                <ThemedText
                  variant="body"
                  color="secondaryText"
                  style={{ fontWeight: "bold" }}
                >
                  {` ${formatDuration(
                    safePieChartData.reduce(
                      (acc: number, item: any) => acc + item.population,
                      0
                    )
                  )} de travail`}
                </ThemedText>
                <PieChart
                  data={safePieChartData}
                  width={screenWidth}
                  height={245}
                  chartConfig={chartConfig}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"100"}
                  center={[0, 0]}
                  hasLegend={false}
                />
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    width: "95%",
                  }}
                >
                  {safePieChartData.map((item: any, index: number) => {
                    const hours = Math.floor(item.population / 60);
                    const minutes = item.population % 60;
                    const timeDisplay =
                      hours > 0
                        ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`
                        : `${minutes}min`;
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          width: "50%",
                          marginBottom: 4,
                        }}
                      >
                        <View
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: 6,
                            backgroundColor: item.color,
                            marginRight: 8,
                          }}
                        />
                        <ThemedText
                          variant="body"
                          color="secondaryText"
                          style={{
                            flex: 1,
                            fontSize: 13,
                          }}
                        >
                          {item.name}:{" "}
                          <ThemedText
                            variant="body"
                            color="secondaryText"
                            style={{
                              fontWeight: "bold",
                              fontSize: 13,
                            }}
                          >
                            {timeDisplay}
                          </ThemedText>
                        </ThemedText>
                      </View>
                    );
                  })}
                </View>
              </BlockWrapper>
              <BlockWrapper direction="column" fullHeight={true}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <ThemedText variant="header2" color="secondaryText">
                    Temps de travail{" "}
                  </ThemedText>
                </View>
                <LineChart
                  data={safeLineChartData}
                  width={screenWidth - 50}
                  height={255}
                  verticalLabelRotation={35}
                  chartConfig={chartConfig}
                  style={{ paddingBottom: 10 }}
                  bezier
                  formatYLabel={(value) =>
                    Math.round(Number(value)).toString() + "h"
                  }
                />
                {value === "month" && (
                  <View
                    style={{
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <ThemedText variant="body" color="secondaryText">
                      Semaine par semaine
                    </ThemedText>
                  </View>
                )}
              </BlockWrapper>
            </MainWrapper>
          </View>
        </SafeAreaView>
        <ModalMenu
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        >
          {modalType === "menu" && <Menu setModalVisible={setModalVisible} />}
        </ModalMenu>
      </>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
