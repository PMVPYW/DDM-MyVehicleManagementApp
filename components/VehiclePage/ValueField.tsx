import { View, Text } from "react-native"

export default function ValueField(props) {
    console.warn(props)
    return <>
        {props.value ? 
            <View className="flex flex-row items-center mb-2 mr-2 max-w-full">
            <Text className="text-xl">{props.name}: </Text><Text className="text-lg bg-gray-300 rounded-lg p-1 break-before-auto break-words">{props.value} {props.suffix ?? ''}</Text>
        </View>  : <></>
        }</>

}