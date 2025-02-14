import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "./hooks/useThemeColors";
import Header from "./components/Header";
import DateDisplay from "./components/DateDisplay";
import { useState } from "react";

export default function Index() {
  const [date, setDate] = useState(new Date().toLocaleDateString())
  const colors = useThemeColors();
  return (
    <SafeAreaView style={[styles.container, {
      backgroundColor: colors.primary
    }]}>
      <StatusBar/>
      <Header />
      <DateDisplay date={date} setDate={setDate}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})