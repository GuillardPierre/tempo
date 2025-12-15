import React from "react";
import CustomSnackBar from "../../components/utils/CustomSnackBar";
import ENDPOINTS from "../../components/utils/ENDPOINT";
import { httpPost } from "../../components/utils/querySetup";
import TextButton from "../../components/utils/TextButton";
import ThemedText from "../../components/utils/ThemedText";
import CustomTextInput from "../../forms/utils/CustomTextInput";
import useSnackBar from "../../hooks/useSnackBar";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useMutation } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import {
  StatusBar,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import {
  forgotPasswordSchema,
  ForgotPasswordData,
} from "../../schema/forgotPassword";
import { toFormikValidationSchema } from "zod-formik-adapter";

export default function ForgotPassword() {
  const colors = useThemeColors();
  const { color, open, message, setOpen, setSnackBar } = useSnackBar();

  const { mutate: submitForgotPassword, isPending } = useMutation<
    any,
    Error,
    ForgotPasswordData
  >({
    mutationFn: async (formData) => {
      const response = await httpPost(ENDPOINTS.auth.forgotPassword, formData);
      if (!response) {
        throw new Error("Erreur réseau");
      }

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Échec de l'envoi de l'email");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data, variables) => {
      setSnackBar(
        "info",
        "Email envoyé avec le code de réinitialisation. Redirection..."
      );
      setTimeout(() => {
        router.push({
          pathname: "/screens/auth/ResetPassword",
          params: { email: variables.email },
        });
      }, 2000);
    },
    onError: (error) => {
      console.log(error.message);
      if (
        error.message.includes("not found") ||
        error.message.includes("404")
      ) {
        setSnackBar("error", "Aucun compte associé à cette adresse email");
        return;
      }
      setSnackBar("error", "Erreur lors de l'envoi de l'email");
    },
  });
  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ThemedText variant="header1" color="primaryText" style={styles.title}>
          Mot de passe oublié
        </ThemedText>

        <ThemedText variant="body" color="primaryText" style={styles.subtitle}>
          Rentrez votre email pour recevoir un code de réinitialisation
        </ThemedText>

        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={toFormikValidationSchema(forgotPasswordSchema)}
          onSubmit={(values) => {
            submitForgotPassword(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <CustomTextInput
                name="email"
                label="Adresse email"
                placeholder="Adresse email"
                onChangeText={handleChange("email")}
                onBlur={() => handleBlur("email")}
                value={values.email}
                autoCapitalize="none"
                error={touched.email && errors.email ? errors.email : undefined}
              />

              <View
                style={[styles.button, { backgroundColor: colors.secondary }]}
              >
                <TextButton
                  onPress={handleSubmit}
                  text="Envoyer le code"
                  isPending={isPending}
                />
              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
      <Link style={styles.link} href="/screens/auth/Login">
        Retour au login
      </Link>

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
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  link: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
    textAlign: "center",
    marginBottom: 30,
  },
});
