import { Modal, StyleSheet, View, Pressable } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import Menu from "./menu";

type Props = {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

export default function ModalMenu({modalVisible, setModalVisible}: Props) {
    const colors = useThemeColors();
    return (
        <Modal 
            transparent 
            visible={modalVisible} 
            onRequestClose={() => setModalVisible(false)}
            animationType="fade"
        >
            <Pressable 
                style={styles.overlay} 
                onPress={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Menu/>
                </View>  
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        borderWidth: 7,
        borderRadius: 8,
        borderColor: "#FF8F33",
        backgroundColor: "#FFF", 
        width: "90%",
        height: "40%",
        margin: "auto",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    }
})
