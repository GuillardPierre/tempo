import { Pressable, StyleSheet } from "react-native";
import ThemedText from "./ThemedText";

type Props = {
    text: string;
    action: () => void;
}

export default function ButtonMenu({text, action} : Props) {
    return (
        <Pressable style={styles.button} onPress={action}>
            <ThemedText style={styles.textButton}>{text}</ThemedText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        maxHeight: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 4,
        borderColor: '#8955FD',
        backgroundColor: "#C2B2FF",  
    },
    textButton : {
        fontSize: 20,
        fontWeight: 'bold',
    }
})

