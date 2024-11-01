import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
  const [model, setModel] = useState({});
  const [fuelIcon, setfuelIcon] = useState('');
  useEffect(()=>{
  fetch(`https://www.carqueryapi.com/api/0.3?cmd=getModel&model=${props.vehicle?.model_id}`).then(res=>{
    console.error(`https://www.carqueryapi.com/api/0.3?cmd=getModel&model=${props.vehicle?.model_id}`)
    res.json().then(data=>{
      setModel(data[0]);
      console.error(data);

      fuelIcon

    })
  }).catch(err=>console.error(err));
}, [props.vehicle?.model_id]);
  

 
  return (
    <View className="w-1/2 my-2">
        <View className="w-11/12 bg-gray-300 h-80 rounded-xl mx-auto">
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
            <Text>Power: {model?.model_engine_power_hp} cv / {model?.model_engine_power_rpm} rpm</Text>
        </View>
    </View>
  );
};

export default Vehicle;
