import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

const VehiclesScreen = () => {

  const [cars, setCars] = useState([
    { id: 1, marca: "mitsubishi", modelo: "lancer", ano: 1997, cilindrada: 2800 },
    { id: 2, marca: "ford", modelo: "focus", ano: 2005, cilindrada: 2000 },
    { id: 3, marca: "chevrolet", modelo: "cruze", ano: 2016, cilindrada: 1600 },
    { id: 4, marca: "toyota", modelo: "corolla", ano: 2020, cilindrada: 1800 }
  ]);

  return (
    <SafeAreaView>
      <View className="bg-red-500 mt-8">
        <Text className="p-2 text-xl">Os meus veículos</Text>
      </View>
    </SafeAreaView>
  );
};

export default VehiclesScreen;
