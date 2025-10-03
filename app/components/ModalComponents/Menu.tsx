import React from "react";
import { StyleSheet, View } from "react-native";
import ButtonMenu from "../ButtonMenu";
import { deleteToken } from "../utils/utils";
import { router, useSegments } from "expo-router";
import { useAuth } from "../../context/authContext";

type Props = {
  setModalVisible: (visible: boolean) => void;
};

export default function Menu({ setModalVisible }: Props) {
  const segments = useSegments();
  const nomScreen = segments[segments.length - 1]; // Le dernier segment est souvent le nom du screen
  const isHomepage = nomScreen === "Homepage";
  const { dispatch } = useAuth();

  return (
    <View style={styles.container}>
      {!isHomepage && (
        <ButtonMenu
          type="square"
          text="Accueil"
          action={() => {
            router.push("/screens/Homepage");
            setModalVisible(false);
          }}
        />
      )}
      <ButtonMenu
        type="square"
        text="FAQ"
        action={() => {
          router.push("/screens/tutorial");
          setModalVisible(false);
        }}
      />
      <ButtonMenu
        type="square"
        text={"Mes catégories"}
        action={() => {
          router.push("/screens/categories");
          setModalVisible(false);
        }}
      />
      <ButtonMenu
        type="square"
        text="Profil"
        action={() => {
          router.push("/screens/profile");
          setModalVisible(false);
        }}
      />
      <ButtonMenu
        type="square"
        text="Se déconnecter"
        action={() => {
          deleteToken().then(() => {
            dispatch({ type: "RESET" });
            setModalVisible(false);
            router.replace("/screens/auth/Login");
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 5,
    gap: 10,
    paddingHorizontal: 50,
    alignItems: "center",
  },
});
