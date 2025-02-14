import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import SquareButton from "./SquareButton";
import { useThemeColors } from "../hooks/useThemeColors";
export default function Header() {
    const colors = useThemeColors()
    return (
        <View style={[styles.header, {backgroundColor: colors.primary}]}>
            <ThemedText variant="header1" color="primaryText">Temp-o-s</ThemedText>
            <SquareButton type="close" onPress={() => {}}/>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 8,
    }
})
