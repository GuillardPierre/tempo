import React from "react";
import { Text, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useVibration } from "../../hooks/useVibration";
import DropDownPicker from "react-native-dropdown-picker";
import ButtonMenu from "../../components/ButtonMenu";
import BlockWrapper from "../../components/BlockWrapper";
import ThemedText from "../../components/utils/ThemedText";
import { Category } from "../../types/worktime";

interface CategorySelectorProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string | null;
  categories: Category[];
  onSelectCategory: (category: { id: string; title: string }) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  onCreateCategory: (name: string) => Promise<Category | null>;
  onCategoryCreated: (category: Category) => void;
  error?: string;
  touched?: boolean;
  maxHeight?: number; // Nouvelle prop optionnelle pour contrôler la hauteur
}

export default function CategorySelector({
  open,
  setOpen,
  value,
  categories,
  onSelectCategory,
  searchText,
  setSearchText,
  onCreateCategory,
  onCategoryCreated,
  error,
  touched,
  maxHeight, // Nouvelle prop
}: CategorySelectorProps) {
  const colors = useThemeColors();
  const { vibrate } = useVibration();
  const screenHeight = Dimensions.get("window").height;
  const insets = useSafeAreaInsets();

  const modalMaxHeight = Math.min(
    maxHeight || screenHeight * 0.8,
    screenHeight - insets.top - insets.bottom
  );
  return (
    <>
      <DropDownPicker
        open={open}
        value={value}
        items={categories.map((c) => ({
          label: c.name,
          value: String(c.id),
        }))}
        setOpen={setOpen}
        setValue={(callback) => {
          const currentValue = callback(value);
          return currentValue;
        }}
        onPress={() => {
          vibrate();
        }}
        onClose={() => {
          vibrate();
        }}
        onSelectItem={(item) => {
          vibrate();
          if (item && item.value) {
            const itemValue = item.value.toString();
            const category = categories.find((c) => String(c.id) === itemValue);
            if (category) {
              onSelectCategory({
                id: itemValue,
                title: category.name,
              });
            }
          }
        }}
        searchable={true}
        searchPlaceholder="Tapez pour rechercher ou créer une catégorie"
        onChangeSearchText={(text) => {
          setSearchText(text);
        }}
        placeholder="Sélectionnez une catégorie"
        style={{
          borderWidth: 3,
          borderRadius: 12,
          marginBottom: 2,
          width: "100%",
          borderColor: colors.primary,
        }}
        dropDownContainerStyle={{
          borderWidth: 3,
          borderRadius: 4,
          width: "100%",
          backgroundColor: colors.background,
          borderColor: colors.primary,
        }}
        listMode="MODAL"
        modalAnimationType="slide"
        placeholderStyle={{ fontWeight: 500 }}
        modalContentContainerStyle={{
          borderWidth: 3,
          borderRadius: 12,
          maxHeight: modalMaxHeight,
          width: "95%",
          alignSelf: "center",
          marginTop: insets.top + 20,
          backgroundColor: colors.background,
          borderColor: colors.secondary,
        }}
        modalProps={{
          presentationStyle: "overFullScreen",
          transparent: true,
          animationType: "slide",
          statusBarTranslucent: true,
        }}
        ListEmptyComponent={(props) =>
          searchText.length > 0 ? (
            <ButtonMenu
              style={{
                width: "95%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              type="round"
              text={`Créer "${searchText}"`}
              action={async () => {
                const newCategory = await onCreateCategory(searchText);

                if (newCategory) {
                  onCategoryCreated(newCategory);
                  onSelectCategory({
                    id: String(newCategory.id),
                    title: newCategory.name,
                  });
                  setSearchText(newCategory.name);
                  setTimeout(() => {
                    setOpen(false);
                  }, 100);
                }
              }}
            />
          ) : (
            <BlockWrapper
              style={{ maxHeight: 100 }}
              backgroundColor={colors.primaryLight}
            >
              <ThemedText>
                Créez une catégorie en tapant dans la barre de recherche
              </ThemedText>
            </BlockWrapper>
          )
        }
      />

      {touched && !value && (
        <Text
          style={{
            fontSize: 12,
            marginBottom: 10,
            paddingLeft: 5,
            color: colors.primary,
          }}
        >
          Veuillez sélectionner une catégorie
        </Text>
      )}
    </>
  );
}
