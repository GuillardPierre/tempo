import SignupForm from "../../components/forms/SignupForm";
import CustomSnackBar from "../../components/utils/CustomSnackBar";
import TextButton from "../../components/utils/TextButton";
import ThemedText from "../../components/utils/ThemedText";
import useSnackBar from "../../hooks/useSnackBar";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Snackbar } from "react-native-paper";

export default function Signup() {
  const colors = useThemeColors();
  const router = useRouter();
  const { color, open, message, setOpen, setSnackBar } = useSnackBar();

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
        },
      ]}
    >
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ThemedText variant="header1" color="primaryText">
          Bienvenue sur Tempo
        </ThemedText>
        <ThemedText style={styles.header} variant="body" color="primaryText">
          Nous respectons votre vie privée : aucune donnée partagée, suppression
          du compte possible à tout moment.
        </ThemedText>

        <SignupForm setSnackBar={setSnackBar} />
        <TextButton
          style={styles.button}
          onPress={() => {
            // Redirect to Login screen
            router.push("/screens/auth/Login");
          }}
          text="Déjà un compte ?"
        />
      </KeyboardAvoidingView>
      <CustomSnackBar
        color={color}
        message={message}
        open={open}
        setOpen={setOpen}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    marginBlock: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});
