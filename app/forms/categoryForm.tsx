import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Category } from "../types/worktime";
import ThemedText from "../components/utils/ThemedText";
import { Formik } from "formik";
import { httpPut } from "../components/utils/querySetup";
import ENDPOINTS from "../components/utils/ENDPOINT";
import { useThemeColors } from "../hooks/useThemeColors";
import { useVibration } from "../hooks/useVibration";
import ButtonMenu from "../components/ButtonMenu";
import BlockWrapper from "../components/BlockWrapper";

import useSnackBar from "../hooks/useSnackBar";

type Props = {
  category: Category;
  setModalVisible: (visible: boolean) => void;
  onCancel?: () => void;
  setCategories: (
    categories: Category[] | ((prev: Category[]) => Category[])
  ) => void;
};

export default function CategoryForm({
  category,
  setModalVisible,
  onCancel,
  setCategories,
}: Props) {
  const { setSnackBar } = useSnackBar();
  const colors = useThemeColors();
  const { vibrate } = useVibration();
  return (
    <View style={[styles.container]}>
      {/* <ThemedText color='secondaryText'>{category.name}</ThemedText> */}
      <View>
        <Formik
          initialValues={{
            name: category.name,
          }}
          onSubmit={async (values) => {
            const rep = await httpPut(
              `${ENDPOINTS.category.root}${category.id}`,
              values
            );
            if (rep.ok) {
              setSnackBar("info", "Catégorie mise à jour");
              setModalVisible(false);
              setCategories((categories) =>
                categories.map((c) =>
                  c.id === category.id ? { ...c, name: values.name } : c
                )
              );
            } else {
              setSnackBar(
                "error",
                "Erreur lors de la mise à jour de la catégorie"
              );
            }
          }}
        >
          {({ values, setFieldValue, handleSubmit, errors, touched }) => (
            <>
              <View style={styles.formContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      color: colors.secondaryText,
                      borderColor: colors.primary,
                    },
                  ]}
                  value={values.name}
                  onChangeText={(text) => setFieldValue("name", text)}
                />
                <BlockWrapper
                  backgroundColor={colors.error}
                  style={{ minHeight: 60 }}
                >
                  <ThemedText>
                    Attention toutes les entrées de cette catégorie seront
                    modifiées.
                  </ThemedText>
                </BlockWrapper>
                <View style={styles.buttonsContainer}>
                  <ButtonMenu
                    type="round"
                    text="Annuler"
                    action={() => {
                      vibrate();
                      if (onCancel) {
                        onCancel();
                      } else {
                        setModalVisible(false);
                      }
                    }}
                  />
                  <ButtonMenu
                    type="round"
                    style={{
                      backgroundColor: colors.error,
                    }}
                    text="Modifier"
                    action={() => {
                      vibrate();
                      handleSubmit();
                    }}
                  />
                </View>
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // padding: 10,
    paddingVertical: 10,
    paddingBottom: 50,
  },
  formContainer: {
    width: "100%",
    // padding: 12,
    gap: 12,
  },
  textInput: {
    borderRadius: 12,
    padding: 10,
    borderWidth: 3,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    width: "50%",
  },
});
