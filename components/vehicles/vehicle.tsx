import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

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
  

const Vehicle = (props: Props) => {

  console.error(props.vehicle);
  if (Object.keys(props.vehicle).length < 20) {
    console.warn(props.vehicle);
  }
  return (
    <View className="w-1/2 my-2">
        <View className="w-11/12 bg-gray-300 h-80 rounded-xl mx-auto">
            <Text>{props.vehicle.id}</Text>
            <Text>{props.vehicle.model_make_display ?? props.vehicle.model_id}</Text>
            <Text>{props.vehicle.model_name}</Text>
        </View>
    </View>
  );
};

export default Vehicle;
