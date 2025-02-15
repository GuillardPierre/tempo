import { StyleSheet, View, Image, Pressable } from "react-native";
import ThemedText from "./ThemedText";
import { useThemeColors } from "../hooks/useThemeColors";
import React from "react";
import TrashIcon from "@/assets/svg-icons/trash";
import { SvgUri } from 'react-native-svg';

type Props = {
    type: 'time' | 'button'
    text: string
    duration?: string
}

export default function Block({type, text, duration}: Props) {
    const colors = useThemeColors()
    return (
        <View style={[styles.container, {backgroundColor: colors.primaryLight}]}>
            <ThemedText variant="header1" color="primaryText">{text}</ThemedText>
            {type === 'time' && ( 
                <>
                    <ThemedText>{`Durée: ${duration}`}</ThemedText>
                    <Pressable onPress={() => {}}>
                        <SvgUri uri={TrashIcon} />
                    </Pressable>
                </>
                )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 4,
        borderColor: '#8955FD',  
        paddingBlock: 10,
        paddingHorizontal: 20,
    },
})


