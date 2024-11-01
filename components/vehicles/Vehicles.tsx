import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import Vehicle from './vehicle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

const VehiclesScreen = (props) => {
  let rerender = props.route.params?.rerender;
  const navigation = useNavigation();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('vehicles').then(val => {
      setCars(JSON.parse(val));
      JSON.parse(val).map((car) => {
        console.warn(car.id, Object.keys(car).length, car);
      });
    })
  }, [props.route.params?.rerender]);

  return (
    <SafeAreaView className="h-screen w-full mb-[10x] pt-8 bg-white">
      

      <FlatList className="w-11/12 mx-auto h-full flex flex-wrap mb-12" numColumns={2} keyExtractor={item=>item.id} data={cars} renderItem={({item})=><Vehicle vehicle={item} setter_vehicles={setCars}/>}/>
      <TouchableOpacity onPress={()=>navigation.navigate("Create Vehicle")} className="absolute bottom-8 right-5 z-50">
        <Entypo name="squared-plus" size={64} color="blue" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default VehiclesScreen;
