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
  return (
    <View className="w-1/2 my-2">
        <View className="w-11/12 bg-gray-300 h-80 rounded-xl mx-auto">
            <Text>{props.vehicle.item.marca}</Text>
        </View>
    </View>
  );
};

export default Vehicle;
