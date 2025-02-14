import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

const types = {
    "previous": require('@/assets/images/previous.svg'),
    "next": require('@/assets/images/next.svg'),
    "stats": require('@/assets/images/stats.svg'),
    "calendar": require('@/assets/images/calendar.svg'),
    "add": require('@/assets/images/add.svg'),
}

type Props = {
    type: keyof typeof types
    variant: 'primary' | 'secondary'
    size: 'small' | 'medium'
    onPress: () => void
}

export default function RoundButton({type, variant, size, onPress}: Props) {
    const colors = useThemeColors()
    return (
        <>
            <Pressable onPress={onPress}>
                <View style={[styles.button, {backgroundColor: colors[variant]}]}>
                    <Image source={types[type]}></Image>
                </View>
            </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    }
})