import { View } from "react-native";

function Row({children}) {
    return <View className="w-full flex flex-row space-x-2 justify-center">{children}</View>
}

export default Row;