import { SafeAreaView, Text, TouchableOpacity, Image, ScrollView, View } from "react-native"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CountryFlag from "react-native-country-flag";
import { countryToAlpha2 } from "country-to-iso";
import ValueField from "./ValueField";

const VehiclePage = (props) => {
    const navigation = useNavigation();
    const [photo, setPhoto] = useState(props.route.params.vehicle.photo);
    console.error(props.route.params.model?.make_country)
  return (
    <SafeAreaView className="w-full h-full">
        <TouchableOpacity onPressOut={()=>navigation.navigate('TakePhoto', {vehicle_id: props.route.params.vehicle.id, setter_vehicles: props.route.params.setter_vehicles, photo_setter: setPhoto})} className="w-full h-40 bg-gray-200 flex justify-center items-center">
            {photo != undefined ? <Image className="w-full h-full object-cover" source={{uri: photo}}/> : <MaterialCommunityIcons name="camera" size={70} color="black"/>}
        </TouchableOpacity>
        <ScrollView className="w-[97%] h-full mx-auto">
          <View className="w-full h-fit m-4 border-b-2 px-2">
            <Text className="text-2xl font-bold block">Make and Model</Text>
            <View className="flex flex-row justify-around flex-wrap w-full max-w-full">
              <ValueField name="Make" value={<>{props.route.params?.model?.model_make_display} {props.route.params.model?.make_country ? <CountryFlag
                      className=" rounded-md border-0"
                      isoCode={countryToAlpha2(props.route.params.model?.make_country)}
                      size={20}/> : <></>}</>}/>
              <ValueField name="Model" value={props.route.params.model?.model_name + props.route.params.model?.model_trim}/>  
              <ValueField name="Year" value={props.route.params.model?.model_year}/>        
              <ValueField name="Top Speed" value={props.route.params.model?.model_top_speed_kph} suffix="Km/h"/>        
              <ValueField name="Acceleration" value={props.route.params.model?.model_0_to_100_kph} suffix="seconds"/>      
              <ValueField name="Drive" value={props.route.params.model?.model_drive}/>   
              <ValueField name="Transmission" value={props.route.params.model?.model_transmission_type}/>   
              <ValueField name="Doors" value={props.route.params.model?.model_doors}/>  
              <ValueField name="Seats" value={props.route.params.model?.model_seats}/>
              <ValueField name="Body" value={props.route.params.model?.model_body}/>
              <ValueField name="Weight" value={props.route.params.model?.model_weight_kg} suffix="Kg"/> 
              <ValueField name="Length" value={props.route.params.model?.model_length_mm} suffix="mm"/>
              <ValueField name="Width" value={props.route.params.model?.model_width_mm} suffix="mm"/>
              <ValueField name="Height" value={props.route.params.model?.model_height_mm} suffix="mm"/>
              <ValueField name="Wheelbase" value={props.route.params.model?.model_wheelbase_mm} suffix="mm"/>
              <ValueField name="Highway Efficiency" value={props.route.params.model?.model_lkm_hwy} suffix="L/Km"/>
              <ValueField name="City Efficiency" value={props.route.params.model?.model_lkm_city} suffix="L/Km"/>
              <ValueField name="Combined Efficiency" value={props.route.params.model?.model_lkm_mixed} suffix="L/Km"/>
              <ValueField name="Tank Capacity" value={props.route.params.model?.model_fuel_cap_l} suffix="L"/>
            </View>
          </View>
          <View className="w-full h-fit m-4 border-b-2 px-2">
            <Text className="text-2xl font-bold block">Engine</Text>
            <View className="flex flex-row justify-around flex-wrap w-full max-w-full">
                <ValueField name="Position" value={props.route.params.model?.model_engine_position}/>
                <ValueField name="Type" value={props.route.params.model?.model_engine_type}/>
                <ValueField name="Cylinders" value={props.route.params.model?.model_engine_cyl}/>
                <ValueField name="Displacement" value={props.route.params.model?.model_engine_cc} suffix="cc"/>
                <ValueField name="Horsepower" value={props.route.params.model?.model_engine_power_ps} suffix="PS"/>
                <ValueField name="Torque" value={props.route.params.model?.model_engine_torque_nm} suffix="Nm"/>
                <ValueField name="Fuel" value={props.route.params.model?.model_engine_fuel}/>
                <ValueField name="Bore" value={props.route.params.model?.model_engine_bore_mm} suffix="mm"/>
                <ValueField name="Stroke" value={props.route.params.model?.model_engine_stroke_mm} suffix="mm"/>
                <ValueField name="Compression" value={props.route.params.model?.model_engine_compression}/>
                <ValueField name="Valves" value={props.route.params.model?.model_engine_valves}/>
                <ValueField name="Horsepower RPM" value={props.route.params.model?.model_engine_power_rpm}/>
                <ValueField name="Torque RPM" value={props.route.params.model?.model_engine_torque_rpm}/>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}

export default VehiclePage;