import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import SquareButton from "./SquareButton";
import { useThemeColors } from "../hooks/useThemeColors";

type Props = {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

export default function Header({modalVisible, setModalVisible}: Props) {
    const colors = useThemeColors()
    return (
        <View style={[styles.header, {backgroundColor: colors.primary}]}>
            <ThemedText variant="header1" color="primaryText">Temp-o-s</ThemedText>
            <SquareButton type={modalVisible ? "close" : "menu"} onPress={() => setModalVisible(!modalVisible)}/>
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
