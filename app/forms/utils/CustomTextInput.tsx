import React, { useState } from "react";
import { TextInput, TouchableOpacity, StyleSheet, View } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import ThemedText from "../../components/utils/ThemedText";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label?: string;
  name: string; // Nom du champ pour Formik
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void; // Gestion du blur pour Formik
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string | false; // Message d'erreur
  style?: StyleSheet.NamedStyles<any>;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "url"
    | "decimal-pad"
    | "visible-password";
};

export default function CustomTextInput({
  label,
  name,
  value,
  onChangeText,
  onBlur,
  placeholder,
  secureTextEntry = false,
  error,
  style,
  autoCapitalize,
  keyboardType,
}: Props) {
  const colors = useThemeColors();
  const [showPassword, setShowPassword] = useState(false);

  const isEmailField =
    name.toLowerCase().includes("email") ||
    (placeholder && placeholder.toLowerCase().includes("email"));
  const finalAutoCapitalize =
    autoCapitalize || (isEmailField ? "none" : "sentences");

  const isPasswordField =
    secureTextEntry ||
    name.toLowerCase().includes("password") ||
    (placeholder && placeholder.toLowerCase().includes("password"));

  const finalSecureTextEntry = isPasswordField ? !showPassword : false;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <ThemedText style={[styles.label, { color: colors.primaryText }]}>
          {label}
        </ThemedText>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.primaryLight,
              color: colors.primaryText,
              borderColor: error ? "#B22222" : "#8955FD",
              paddingRight: isPasswordField ? 50 : 10, // Espace pour le bouton
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.primaryText}
          secureTextEntry={finalSecureTextEntry}
          autoCapitalize={finalAutoCapitalize}
          keyboardType={keyboardType}
        />
        {isPasswordField && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={colors.primaryText}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <ThemedText style={[styles.error, { color: "red" }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15, // Espace entre les champs
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 5,
    marginBottom: 5,
  },
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    borderWidth: 3,
    borderStyle: "solid",
    borderRadius: 12,
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  passwordToggle: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -15 }],
    padding: 5,
  },
  error: {
    fontSize: 14,
    marginTop: 5,
    paddingLeft: 5,
  },
});
