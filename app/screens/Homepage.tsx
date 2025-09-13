import {
  StatusBar,
  StyleSheet,
  View,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useEffect } from "react";
import { useIndex } from "@/app/hooks/useIndex";
import { useModal } from "@/app/hooks/useModal";
import { useToggleViews } from "@/app/hooks/useToggleViews";
import { useThemeColors } from "@/app/hooks/useThemeColors";
import { useSwipeAnimation } from "@/app/hooks/useSwipeAnimation";
import { RecurrenceException, SelectedWorktime } from "@/app/types/worktime";
import Header from "@/app/components/Header";
import MainWrapper from "@/app/components/MainWrapper";
import Calendar from "@/app/components/Calendar";
import Footer from "@/app/components/Footer";
import ModalMenu from "@/app/components/Modal";
import Menu from "@/app/components/ModalComponents/Menu";
import CustomSnackBar from "@/app/components/utils/CustomSnackBar";
import UpdateDeleteModal from "@/app/components/ModalComponents/UpdateDeleteModal";
import WorktimeSelectAction from "@/app/components/WorktimeSelectAction";
import ExceptionsList from "@/app/components/ExceptionsList";
import WorktimesList from "@/app/components/WorktimesList";
import UnfinishedWorktimesList from "@/app/components/UnfinishedWorktimesList";
import PauseForm from "../forms/PauseForm";
import ProtectedRoute from "@/app/components/utils/ProtectedRoute";

export default function Homepage() {
  const colors = useThemeColors() || {
    primary: "#3D348B",
    background: "#FFFFFF",
  };

  const {
    worktimesByDay,
    monthWorktimes,
    recurrenceExceptions,
    unfinishedWorktimes,
    categories,
    date,
    setDate,
    month,
    setMonth,
    setWorktimes,
    setWorktimesByDay,
    setRecurrenceExceptions,
    setCategories,
    selectedWorktime,
    setSelectedWorktime,
    setUnfinishedWorktimes,
    color,
    open,
    message,
    setOpen,
    setSnackBar,
    selectedException,
    setSelectedException,
    getWorktimes,
  } = useIndex();
  const currentDateRef = useRef<string>(date);

  useEffect(() => {
    currentDateRef.current = date;
  }, [date]);

  const { modalVisible, modalType, openModal, setModalType, setModalVisible } =
    useModal();

  const {
    calendarIsOpen,
    timerIsOpen,
    formIsOpen,
    chronoOpen,
    setFormIsOpen,
    toggleCalendar,
    toggleTimer,
    handleChronoStart,
    handleChronoClose,
  } = useToggleViews();

  const handleExceptionPress = (exception: RecurrenceException) => {
    setSelectedException(exception);
    openModal("exception");
  };

  const getSelectedWorktimeForUpdate = () => {
    if (!selectedWorktime) return null;

    const selected: SelectedWorktime = {
      ...selectedWorktime,
      recurrence: selectedWorktime.recurrence
        ? JSON.stringify(selectedWorktime.recurrence)
        : "",
      isRecurring: selectedWorktime.type === "RECURRING",
      startDate: selectedWorktime.startDate,
      endDate: selectedWorktime.endDate,
    };

    return selected;
  };

  const { swipeAnimatedStyle, panResponder } = useSwipeAnimation({
    setDate,
    currentDateRef,
    setWorktimesByDay,
  });

  const screenWidth = Dimensions.get("window").width;

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <Header
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setModalType={setModalType}
          date={date}
          setDate={setDate}
          setCalendarIsOpen={toggleCalendar}
          todayWorktimes={worktimesByDay.today}
        />
        <View style={[{ position: "relative", flex: 1 }]}>
          {/* Zone de swipe gauche */}

          <Animated.View
            style={[
              {
                flexDirection: "row",
                width: screenWidth * 3,
                height: "100%",
                position: "absolute",
                left: -screenWidth + 20,
              },
              swipeAnimatedStyle,
            ]}
            {...panResponder.panHandlers}
          >
            {/* Bloc gauche */}
            <MainWrapper
              style={{
                width: "31.7%",
                height: "99%",
                maxHeight: chronoOpen
                  ? "52%"
                  : timerIsOpen
                  ? formIsOpen
                    ? "48%"
                    : "83%"
                  : calendarIsOpen
                  ? "47.3%"
                  : "100%",
                backgroundColor: colors.background,
                marginInline: 0,
                marginBlock: 0,
                marginTop: 5.5,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <UnfinishedWorktimesList
                  unfinishedWorktimes={unfinishedWorktimes}
                  currentDate={date}
                  recurrenceExceptions={recurrenceExceptions}
                  setModalType={setModalType}
                  setModalVisible={setModalVisible}
                  setSelectedWorktime={setSelectedWorktime}
                  setUnfinishedWorktimes={setUnfinishedWorktimes}
                  setWorktimes={setWorktimes}
                  setWorktimesByDay={setWorktimesByDay}
                  setSnackBar={setSnackBar}
                  onWorktimeStopped={() => {
                    getWorktimes();
                  }}
                />
                <ExceptionsList
                  exceptions={recurrenceExceptions}
                  date={new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000)
                    .toISOString()
                    .slice(0, 10)}
                  onExceptionPress={handleExceptionPress}
                />
                <WorktimesList
                  worktimes={worktimesByDay.yesterday}
                  currentDate={date}
                  recurrenceExceptions={recurrenceExceptions}
                  setModalType={setModalType}
                  setModalVisible={setModalVisible}
                  setSelectedWorktime={setSelectedWorktime}
                  onAddPress={toggleTimer}
                />
              </View>
            </MainWrapper>

            {/* Bloc central - contenu principal */}
            <View
              style={{
                width: "33.33%",
                height: "99%",
                maxHeight: chronoOpen
                  ? "52%"
                  : timerIsOpen
                  ? formIsOpen
                    ? "48%"
                    : "83%"
                  : calendarIsOpen
                  ? "47.5%"
                  : "100%",
              }}
            >
              <MainWrapper
                style={{
                  height: "100%",
                }}
              >
                <UnfinishedWorktimesList
                  unfinishedWorktimes={unfinishedWorktimes}
                  currentDate={date}
                  recurrenceExceptions={recurrenceExceptions}
                  setModalType={setModalType}
                  setModalVisible={setModalVisible}
                  setSelectedWorktime={setSelectedWorktime}
                  setUnfinishedWorktimes={setUnfinishedWorktimes}
                  setWorktimes={setWorktimes}
                  setWorktimesByDay={setWorktimesByDay}
                  setSnackBar={setSnackBar}
                  onWorktimeStopped={() => {
                    getWorktimes();
                  }}
                />
                <ExceptionsList
                  exceptions={recurrenceExceptions}
                  date={date}
                  onExceptionPress={handleExceptionPress}
                />
                <WorktimesList
                  worktimes={worktimesByDay.today}
                  currentDate={date}
                  recurrenceExceptions={recurrenceExceptions}
                  setModalType={setModalType}
                  setModalVisible={setModalVisible}
                  setSelectedWorktime={setSelectedWorktime}
                  setWorktimes={setWorktimes}
                  onAddPress={toggleTimer}
                />
              </MainWrapper>
            </View>

            {/* Bloc droit */}
            <MainWrapper
              style={{
                width: "31.8%",
                height: "99%",
                maxHeight: chronoOpen
                  ? "52%"
                  : timerIsOpen
                  ? formIsOpen
                    ? "48%"
                    : "83%"
                  : calendarIsOpen
                  ? "47.5%"
                  : "100%",
                backgroundColor: colors.background,
                marginInline: 0,
                marginBlock: 0,
                marginTop: 4,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <UnfinishedWorktimesList
                  unfinishedWorktimes={unfinishedWorktimes}
                  currentDate={date}
                  recurrenceExceptions={recurrenceExceptions}
                  setModalType={setModalType}
                  setModalVisible={setModalVisible}
                  setSelectedWorktime={setSelectedWorktime}
                  setUnfinishedWorktimes={setUnfinishedWorktimes}
                  setWorktimes={setWorktimes}
                  setWorktimesByDay={setWorktimesByDay}
                  setSnackBar={setSnackBar}
                  onWorktimeStopped={() => {
                    getWorktimes();
                  }}
                />
                <ExceptionsList
                  exceptions={recurrenceExceptions}
                  date={new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
                    .toISOString()
                    .slice(0, 10)}
                  onExceptionPress={handleExceptionPress}
                />
                <WorktimesList
                  worktimes={worktimesByDay.tomorrow}
                  currentDate={new Date(
                    new Date(date).getTime() + 24 * 60 * 60 * 1000
                  )
                    .toISOString()
                    .slice(0, 10)}
                  recurrenceExceptions={recurrenceExceptions}
                  setModalType={setModalType}
                  setModalVisible={setModalVisible}
                  setSelectedWorktime={setSelectedWorktime}
                  onAddPress={toggleTimer}
                />
              </View>
            </MainWrapper>
          </Animated.View>

          <MainWrapper
            isOpen={timerIsOpen}
            direction="bottom"
            maxHeight="35%"
            minHeight={formIsOpen ? "38%" : "auto"}
            style={{
              paddingHorizontal: 30,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <WorktimeSelectAction
              setSnackBar={setSnackBar}
              setTimerIsOpen={toggleTimer}
              setWorktimes={setWorktimes}
              categories={categories}
              setCategories={setCategories}
              date={date}
              setFormIsOpen={setFormIsOpen}
              setRecurrenceExceptions={setRecurrenceExceptions}
              recurrenceExceptions={recurrenceExceptions}
              onChronoStart={handleChronoStart}
              onChronoClose={handleChronoClose}
              timerIsOpen={timerIsOpen}
              setUnfinishedWorktimes={setUnfinishedWorktimes}
            />
          </MainWrapper>
          <MainWrapper
            isOpen={calendarIsOpen}
            direction="bottom"
            maxHeight="42%"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Calendar
              date={date}
              setDate={setDate}
              monthWorktimes={monthWorktimes}
              month={month}
              setMonth={setMonth}
              recurrenceExceptions={recurrenceExceptions}
            />
          </MainWrapper>
        </View>

        <Footer
          setTimerIsOpen={toggleTimer}
          timerIsOpen={timerIsOpen}
          calendarIsOpen={calendarIsOpen}
          setCalendarIsOpen={toggleCalendar}
        />

        <ModalMenu
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        >
          {modalType === "menu" && <Menu setModalVisible={setModalVisible} />}
          {modalType === "update" && (
            <UpdateDeleteModal
              selectedWorktime={getSelectedWorktimeForUpdate()}
              setModalVisible={setModalVisible}
              categories={categories}
              setCategories={setCategories}
              setWorktimes={setWorktimes}
              setSnackBar={setSnackBar}
              date={date}
            />
          )}
          {modalType === "exception" && (
            <PauseForm
              selectedException={selectedException}
              setModalVisible={setModalVisible}
              setSnackBar={setSnackBar}
              setRecurrenceExceptions={setRecurrenceExceptions}
              recurrenceExceptions={recurrenceExceptions}
              date={date}
            />
          )}
        </ModalMenu>

        <CustomSnackBar
          color={color}
          message={message}
          open={open}
          setOpen={setOpen}
        />
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
