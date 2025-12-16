import { View, StyleSheet } from "react-native";
import React from "react";
import { Formik } from "formik";
import { useThemeColors } from "../hooks/useThemeColors";
import { useVibration } from "../hooks/useVibration";
import { createWorkTimeSchema } from "../schema/createWorkTime";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Category, SelectedWorktime } from "../types/worktime";
import { useTimerForm } from "./useTimerForm";
import { formatRecurrenceRule, parseRecurrenceRule } from "../utils/recurrence";
import { formatLocalDateTime } from "../components/utils/utils";
import CategorySelector from "./components/CategorySelector";
import DateTimeSelectors from "./components/DateTimeSelectors";
import RecurrenceSettings from "./components/RecurrenceSettings";
import FormActions from "./components/FormActions";

type TimerFormMode = "chrono" | "activity";

interface Props {
  setSnackBar: (type: "error" | "info", message: string) => void;
  setTimerIsOpen: (isOpen: boolean) => void;
  setWorktimes?: (worktimes: any[] | ((prevWorktimes: any[]) => any[])) => void;
  categories?: Category[];
  setCategories?: (
    categories: Category[] | ((prevCategories: Category[]) => Category[])
  ) => void;
  selectedWorktime?: SelectedWorktime | null;
  isEditing?: boolean;
  date: string;
  mode: TimerFormMode;
  onChronoClose?: () => void;
  setUnfinishedWorktimes?: (
    worktimes: any[] | ((prevWorktimes: any[]) => any[])
  ) => void;
  unfinishedWorktimes?: any[];
  onWorktimeStopped?: () => void;
}

export default function TimerForm({
  setSnackBar,
  setTimerIsOpen,
  setWorktimes,
  categories = [],
  setCategories,
  selectedWorktime = null,
  isEditing = false,
  date,
  mode,
  onChronoClose,
  setUnfinishedWorktimes,
  unfinishedWorktimes = [],
  onWorktimeStopped,
}: Props) {
  const colors = useThemeColors();
  const { vibrate } = useVibration();

  const {
    selectedDays,
    setSelectedDays,
    open,
    setOpen,
    searchText,
    setSearchText,
    submitWorktime,
    handleCategoryCreated,
    getInitialValues,
    daysAreDisplayed,
    createCategory,
    weekdays,
    isRecurring,
    setIsRecurring,
  } = useTimerForm({
    setSnackBar,
    setTimerIsOpen,
    setWorktimes,
    setCategories,
    selectedWorktime,
    isEditing,
    date,
    mode,
    onChronoClose,
    setUnfinishedWorktimes,
  });

  return (
    <View>
      <Formik
        initialValues={{
          ...getInitialValues(),
        }}
        validationSchema={toFormikValidationSchema(createWorkTimeSchema())}
        onSubmit={(values) => {
          submitWorktime({
            ...values,
            startHour: formatLocalDateTime(values.startHour),
            endHour: values.endHour
              ? formatLocalDateTime(values.endHour)
              : null,
            startDate: values.startDate
              ? formatLocalDateTime(values.startDate)
              : null,
            endDate: values.endDate
              ? formatLocalDateTime(values.endDate)
              : null,
            recurrence:
              mode === "activity" && isRecurring && selectedDays.length > 0
                ? formatRecurrenceRule(selectedDays)
                : undefined,
          });
        }}
      >
        {({ setFieldValue, values, handleSubmit, errors, touched }) => {
          const handleDateChange = (date: Date) => {
            vibrate();

            // Pour tous les modes, mettre à jour startHour avec la nouvelle date mais garder l'heure
            if (values.startHour) {
              const currentStartHour = new Date(values.startHour);
              const newStartHour = new Date(date);

              // Garder l'heure, minute, seconde de startHour mais changer la date
              newStartHour.setHours(
                currentStartHour.getHours(),
                currentStartHour.getMinutes(),
                currentStartHour.getSeconds(),
                currentStartHour.getMilliseconds()
              );
              setFieldValue("startHour", newStartHour);
            }

            // Pour le mode activité, mettre à jour aussi endHour avec la nouvelle date
            if (mode === "activity" && values.endHour) {
              const currentEndHour = new Date(values.endHour);
              const newEndHour = new Date(date);

              // Garder l'heure, minute, seconde de endHour mais changer la date
              newEndHour.setHours(
                currentEndHour.getHours(),
                currentEndHour.getMinutes(),
                currentEndHour.getSeconds(),
                currentEndHour.getMilliseconds()
              );
              setFieldValue("endHour", newEndHour);
            }

            setFieldValue("startDate", date);
          };

          return (
            <View
              style={[
                styles.container,
                {
                  paddingVertical: mode === "activity" ? 0 : 10,
                },
              ]}
            >
              <CategorySelector
                open={open}
                setOpen={setOpen}
                value={values.category.id}
                categories={categories}
                onSelectCategory={(category) => {
                  setFieldValue("category", category);
                }}
                searchText={searchText}
                setSearchText={setSearchText}
                onCreateCategory={createCategory}
                onCategoryCreated={handleCategoryCreated}
                error={errors.category?.title}
                touched={touched.category?.title}
              />

              <DateTimeSelectors
                mode={mode}
                selectedDays={selectedDays}
                startDate={values.startDate}
                startHour={values.startHour}
                endHour={values.endHour}
                date={date}
                onDateChange={handleDateChange}
                onStartHourChange={(date) => {
                  setFieldValue("startHour", date);
                  values.startHour &&
                    date > values.startHour &&
                    setFieldValue("endHour", date);
                }}
                onEndHourChange={(date) => {
                  setFieldValue("endHour", date);
                }}
                onSubmit={handleSubmit}
                setSnackBar={setSnackBar}
                category={values.category}
                unfinishedWorktimes={unfinishedWorktimes}
                setUnfinishedWorktimes={setUnfinishedWorktimes}
                onWorktimeStopped={onWorktimeStopped}
              />

              {mode === "activity" && daysAreDisplayed() && (
                <RecurrenceSettings
                  isRecurring={isRecurring}
                  setIsRecurring={setIsRecurring}
                  selectedDays={selectedDays}
                  setSelectedDays={setSelectedDays}
                  weekdays={weekdays}
                  endDate={values.endDate || undefined}
                  onEndDateChange={(date) => {
                    setFieldValue("endDate", date);
                  }}
                  ignoreExceptions={values.ignoreExceptions}
                  onIgnoreExceptionsChange={(value) => {
                    setFieldValue("ignoreExceptions", value);
                  }}
                  isEditing={isEditing}
                />
              )}

              <FormActions
                mode={mode}
                isEditing={isEditing}
                startHour={values.startHour}
                endHour={values.endHour || undefined}
                onSubmit={handleSubmit}
                setSnackBar={setSnackBar}
              />
            </View>
          );
        }}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
