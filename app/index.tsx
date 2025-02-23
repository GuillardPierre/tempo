import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "./hooks/useThemeColors";
import Header from "./components/Header";
import DateDisplay from "./components/DateDisplay";
import { useState } from "react";
import MainWrapper from "./components/MainWrapper";
import Footer from "./components/Footer";
import BlockTime from "./components/BlockTime";
import ModalMenu from "./components/ModalMenu";

export default function Index() {
  const colors = useThemeColors();
  const [date, setDate] = useState(new Date())
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView style={[styles.container, {
      backgroundColor: colors.primary
    }]}  >
      <StatusBar  backgroundColor={colors.primary} barStyle="light-content"/>
      <Header modalVisible={modalVisible} setModalVisible={setModalVisible}/>
      <DateDisplay date={date} setDate={setDate}/>
      <MainWrapper>
          <BlockTime startTime="08:00" endTime="12:00" duration="4h" activity="Work"/>
          <BlockTime startTime="12:00" endTime="13:00" duration="1h" activity="Lunch"/>
          <BlockTime startTime="13:00" endTime="17:00" duration="4h" activity="Work"/>
          <BlockTime startTime="17:00" endTime="18:00" duration="1h" activity="Work"/>
          <BlockTime startTime="18:00" endTime="19:00" duration="1h" activity="Work"/>
          <BlockTime startTime="19:00" endTime="20:00" duration="1h" activity="Work"/>
          <BlockTime startTime="20:00" endTime="21:00" duration="1h" activity="Work"/>
          <BlockTime startTime="21:00" endTime="22:00" duration="1h" activity="Work"/>
          <BlockTime startTime="22:00" endTime="23:00" duration="1h" activity="Work"/>
          <BlockTime startTime="23:00" endTime="00:00" duration="1h" activity="Work"/>
          <BlockTime startTime="00:00" endTime="08:00" duration="8h" activity="Sleep"/>
      </MainWrapper>
      <Footer/>
      <ModalMenu modalVisible={modalVisible} setModalVisible={setModalVisible}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})