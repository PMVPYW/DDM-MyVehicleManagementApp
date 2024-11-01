import { SafeAreaView, Text, TouchableOpacity, Image } from "react-native"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FullScreenCamera from "./camera";
import { useNavigation } from "@react-navigation/native";

const VehiclePage = (props) => {
    const navigation = useNavigation();
    console.error(props.route.params.vehicle.photo)
  return (
    <SafeAreaView className="w-full h-full">
        <TouchableOpacity onPressOut={()=>navigation.navigate('TakePhoto', {vehicle_id: props.route.params.vehicle.id})} className="w-full h-40 bg-gray-200 flex justify-center items-center">
            {props.route.params.vehicle.photo != undefined ? <Image className="w-full h-full object-cover" source={{uri: props.route.params.vehicle.photo}}/> : <MaterialCommunityIcons name="camera" size={70} color="black"/>}
        </TouchableOpacity>
    </SafeAreaView>
  );
}

export default VehiclePage;