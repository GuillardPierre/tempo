import { ScrollView, StyleSheet, View } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

export default function MainWrapper({children}: {children: React.ReactNode}) {
    const colors = useThemeColors()
    return (
        <View style={[styles.wrapper, {backgroundColor: colors.background}]}>
            <View style={[styles.container, {backgroundColor: colors.background}]}>
                <ScrollView >
                    {children}
                </ScrollView>
            </View> 
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginInline: 10,
        marginBlock: 20,
        padding: 15,
        borderRadius: 16,
        borderStyle: 'solid',
        borderWidth: 3,
        borderColor: '#8955FD',      
    }
})
