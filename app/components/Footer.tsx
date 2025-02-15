import { StyleSheet, View } from "react-native";
import RoundButton from "./RoundButton";
import { useThemeColors } from "../hooks/useThemeColors";

export default function Footer() {
    const colors = useThemeColors()
    return (
        <View style={[styles.container, {backgroundColor: colors.primary}]}>
                <RoundButton type="stats" variant="primary" size="small" onPress={() => {}}/>
                <RoundButton type="calendar" variant="primary" size="small" onPress={() => {}}/>
                <RoundButton type="add" variant="primary" size="small" onPress={() => {}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 50,
        paddingVertical: 10,
    },
    
})

