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
    })
  }, []);

  return (
    <SafeAreaView className="h-full w-full mb-[62px] bg-white">
      <View className="mt-8">
        <Text className="mx-auto p-2 text-2xl font-bold">My vehicles</Text>
      </View>

      <FlatList className="w-11/12 mx-auto h-full flex flex-wrap mb-10" numColumns={2} keyExtractor={item=>item.id} data={cars} renderItem={({item})=><Vehicle vehicle={item}/>}/>
      <TouchableOpacity onPress={()=>navigation.navigate("Create Vehicle")} className="absolute bottom-5 right-5 z-50">
        <Entypo name="squared-plus" size={64} color="blue" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default VehiclesScreen;
