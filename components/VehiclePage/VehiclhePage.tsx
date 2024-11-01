import { SafeAreaView, Text, TouchableOpacity, Image } from "react-native"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const VehiclePage = (props) => {
    const navigation = useNavigation();
    const [photo, setPhoto] = useState(props.route.params.vehicle.photo);
    console.error(props.route.params.vehicle.photo)
  return (
    <SafeAreaView className="w-full h-full">
        <TouchableOpacity onPressOut={()=>navigation.navigate('TakePhoto', {vehicle_id: props.route.params.vehicle.id, setter_vehicles: props.route.params.setter_vehicles, photo_setter: setPhoto})} className="w-full h-40 bg-gray-200 flex justify-center items-center">
            {photo != undefined ? <Image className="w-full h-full object-cover" source={{uri: photo}}/> : <MaterialCommunityIcons name="camera" size={70} color="black"/>}
        </TouchableOpacity>
    </SafeAreaView>
  );
}

export default VehiclePage;