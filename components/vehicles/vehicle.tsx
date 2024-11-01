import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CountryFlag from "react-native-country-flag";
import { countryToAlpha2 } from "country-to-iso";
import { useNavigation } from '@react-navigation/native';
interface Car {
    id: number;
    plate?: string,
    region?: string,
    type?: string,
    make?: string,
    model?: string,
    color?: string 
  }
  
  interface CarItem {
    item: Car;
  }

  interface Props {
    vehicle: CarItem
  }
  
const fuelIcons = {
  'Premium Unleaded (Required)': '#007BFF',  // Blue
  'Premium Unleaded (Recommended)': '#ADD8E6',  // Light Blue
  'Flex-Fuel (Unleaded/E85)': '#28A745',  // Green
  'Flex-Fuel (Unleaded/Natural Gas)': '#FFA500',  // Orange
  'Flex-Fuel (Premium Unleaded Requ': '#FFFF00',  // Yellow
  'Regular Unleaded': '#FF0000',  // Red
  'Diesel': '#000000',  // Black
    'Electric': 'green',
}

const  fuelIconMap = {
    'Premium Unleaded (Required)': 'gas-station',
    'Premium Unleaded (Recommended)': 'gas-station',
    'Flex-Fuel (Unleaded/E85)': 'gas-station',
    'Flex-Fuel (Unleaded/Natural Gas)': 'gas-station',
    'Flex-Fuel (Premium Unleaded Requ': 'gas-station',
    'Regular Unleaded': 'gas-station',
    'Diesel': 'gas-station',
    'Electric': 'fuel-cell',
}



const Vehicle = (props: Props) => {
  const navigation = useNavigation();
  const [model, setModel] = useState({});
  useEffect(()=>{
    if (Object.keys(props.vehicle).length === 0) {
      print(props.vehicle)
      return;
    }
  fetch(`https://www.carqueryapi.com/api/0.3?cmd=getModel&model=${props.vehicle?.model_id}`).then(res=>{
    res.json().then(data=>{
      data[0].id = props.vehicle.id;
      setModel(data[0]);
    })
  }).catch(err=>console.error(err));
}, [props.vehicle]);
  

 
  return (
    <TouchableOpacity onPress={()=>{console.warn(model.id);navigation.navigate('Vehicle', {vehicle: props.vehicle, model: {...model}, setter_vehicles: props.setter_vehicles})}} className="w-1/2 my-2">
        <View className="w-11/12 bg-gray-300 h-72 rounded-xl mx-auto">
          <View className="flex justify-center items-center w-full h-32 bg-gray-400 rounded-t-xl">
          {props.vehicle.photo != undefined ? <Image className="w-full h-full object-cover rounded-t-xl" source={{uri: props.vehicle.photo}}/> : <MaterialCommunityIcons name="camera" size={40} color="black"/>}
          </View>
          <View className="h-40 w-full px-2 flex justify-evenly">
            <Text>Make: {model?.model_make_display ?? props.vehicle?.model_id}</Text>
            <Text>Model: {model?.model_name}</Text>
            <Text>Year: {model?.model_year}</Text>
            <View className="flex flex-row items-center">
              <Text className="align-text-top mr-2">Fuel:</Text>
              <MaterialCommunityIcons 
                  name={fuelIconMap[model?.model_engine_fuel]} 
                  size={24} 
                  color={fuelIcons[model?.model_engine_fuel]} 
              />
            </View>
            <Text>Power: {model?.model_engine_power_hp} cv</Text>
            <View className="flex flex-row items-center ">
              <Text className="align-text-top">Make Country: </Text>{model?.make_country ? <CountryFlag
              className=" rounded-md border-0"
              isoCode={countryToAlpha2(model?.make_country)}
              size={20}/> : <></>}
            </View>
          </View>
        </View>
    </TouchableOpacity>
  );
};

export default Vehicle;
