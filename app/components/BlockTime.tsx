import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import Block from "./Block";

type Props = {
    startTime: string
    endTime: string
    activity: string
    duration: string
}

export default function BlockTime({startTime, endTime, activity, duration}: Props) {
    return (
        <View style={styles.container}>
            <ThemedText variant="body" color="secondaryText" style={styles.text}>{startTime}</ThemedText>
            <Block type="time" text={activity} duration={duration}/>
            <ThemedText variant="body" color="secondaryText" style={styles.text}>{endTime}</ThemedText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    text: {
        paddingLeft: 5,
        paddingBlock: 3,
    }
})
