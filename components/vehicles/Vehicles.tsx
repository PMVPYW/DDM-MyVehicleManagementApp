import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import Vehicle from './vehicle';

import Entypo from '@expo/vector-icons/Entypo';

const VehiclesScreen = () => {

  const [cars, setCars] = useState([
    { id: 1, marca: "mitsubishi", modelo: "lancer", ano: 1997, cilindrada: 2800 },
    { id: 2, marca: "ford", modelo: "focus", ano: 2005, cilindrada: 2000 },
    { id: 3, marca: "chevrolet", modelo: "cruze", ano: 2016, cilindrada: 1600 },
      
  ]);

  return (
    <SafeAreaView className="h-full w-full mb-[62px]">
      <View className="mt-8">
        <Text className="mx-auto p-2 text-2xl font-bold">Os meus veículos</Text>
      </View>

      <FlatList className="w-11/12 mx-auto h-full flex flex-wrap mb-10" numColumns={2} keyExtractor={item=>item.id} data={cars} renderItem={(item)=><Vehicle vehicle={item}/>}/>
      <TouchableOpacity className="absolute bottom-5 right-5 z-50">
        <Entypo name="squared-plus" size={64} color="blue" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default VehiclesScreen;
