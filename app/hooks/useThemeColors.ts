import { useColorScheme } from "react-native";
import { Colors } from "../constants/colors";

export const useThemeColors = () => {
    const isDark = useColorScheme() === "dark";

    return isDark ? Colors.dark : Colors.light;
}
