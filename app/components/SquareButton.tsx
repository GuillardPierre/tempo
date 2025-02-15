import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

const types = {
    'close': require('@/assets/images/close.svg'),
    'menu': require('@/assets/images/menu.jpg'),
}

type Props = {
    type?: keyof typeof types;
    onPress: () => void;
}

export default function SquareButton ({type, onPress}: Props) {
    const colors = useThemeColors()

    return (
        <>
        <Pressable onPress={onPress}>
            <View style={[styles.button, {backgroundColor: colors.secondary}]}>
                <Image source={types[type ?? 'close']}></Image>
            </View>
        </Pressable>
    </>
    )
}   

const styles = StyleSheet.create({
    button: {
        width: 52,
        height: 52,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

