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
import { Link, router, useLocalSearchParams } from "expo-router";
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
  resetPasswordSchema,
  ResetPasswordData,
} from "../../schema/resetPassword";
import { toFormikValidationSchema } from "zod-formik-adapter";

export default function ResetPassword() {
  const colors = useThemeColors();
  const { color, open, message, setOpen, setSnackBar } = useSnackBar();
  const { email } = useLocalSearchParams<{ email: string }>();

  const { mutate: submitResetPassword, isPending } = useMutation<
    any,
    Error,
    ResetPasswordData
  >({
    mutationFn: async (formData) => {
      // Transformer les données pour le payload API
      const payload = {
        email: formData.email,
        newPassword: formData.password,
        code: formData.code,
      };
      const response = await httpPost(ENDPOINTS.auth.resetPassword, payload);
      if (!response) {
        throw new Error("Erreur réseau");
      }

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Échec de la réinitialisation");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setSnackBar(
        "info",
        "Mot de passe réinitialisé avec succès. Redirection..."
      );
      setTimeout(() => {
        router.push("/screens/auth/Login");
      }, 2000);
    },
    onError: (error) => {
      console.log(error.message);
      if (
        error.message.includes("invalid") ||
        error.message.includes("expired")
      ) {
        setSnackBar("error", "Code de réinitialisation invalide ou expiré");
        return;
      }
      if (error.message.includes("password")) {
        setSnackBar(
          "error",
          "Le mot de passe ne respecte pas les critères requis"
        );
        return;
      }
      setSnackBar(
        "error",
        "Erreur lors de la réinitialisation du mot de passe"
      );
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
          Nouveau mot de passe
        </ThemedText>

        <ThemedText variant="body" color="primaryText" style={styles.subtitle}>
          Créez votre nouveau mot de passe avec le code reçu par email
          {email && (
            <>
              {"\n"}
              <ThemedText
                variant="body"
                color="primaryText"
                style={styles.emailInfo}
              >
                Email: {email}
              </ThemedText>
            </>
          )}
        </ThemedText>

        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
            code: "",
            email: email || "",
          }}
          validationSchema={toFormikValidationSchema(resetPasswordSchema)}
          onSubmit={(values) => {
            submitResetPassword(values);
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
                name="code"
                label="Code de réinitialisation"
                placeholder="Code reçu par email"
                onChangeText={handleChange("code")}
                onBlur={() => handleBlur("code")}
                value={values.code}
                autoCapitalize="characters"
                error={touched.code && errors.code ? errors.code : undefined}
              />

              <CustomTextInput
                name="password"
                label="Nouveau mot de passe"
                placeholder="Nouveau mot de passe"
                onChangeText={handleChange("password")}
                onBlur={() => handleBlur("password")}
                value={values.password}
                secureTextEntry={true}
                error={
                  touched.password && errors.password
                    ? errors.password
                    : undefined
                }
              />

              <CustomTextInput
                name="confirmPassword"
                label="Confirmer le nouveau mot de passe"
                placeholder="Confirmer le nouveau mot de passe"
                onChangeText={handleChange("confirmPassword")}
                onBlur={() => handleBlur("confirmPassword")}
                value={values.confirmPassword}
                secureTextEntry={true}
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : undefined
                }
              />

              <View
                style={[styles.button, { backgroundColor: colors.secondary }]}
              >
                <TextButton
                  onPress={handleSubmit}
                  text="Réinitialiser le mot de passe"
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
  emailInfo: {
    fontSize: 14,
    fontStyle: "italic",
    opacity: 0.8,
  },
});
