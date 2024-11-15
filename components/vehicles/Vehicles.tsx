import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
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
      setCars(JSON.parse(val) || []);
    });
  }, [rerender]);

  // ListEmptyComponent as a separate function for better readability
  const renderEmptyComponent = () => (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl">No cars found!</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Create Vehicle")}
        className="rounded-xl my-2"
        style={{ backgroundColor: 'blue' }}
      >
        <Text className="text-white p-2">Click Here to add a vehicle!</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 w-full">
      {cars.length === 0 ? (
        // Render the empty component when there are no cars
        renderEmptyComponent()
      ) : (
        // Render the FlatList when there are cars
        <FlatList
          className="w-11/12 mx-auto h-full flex flex-wrap" contentContainerStyle={{
            alignItems: 'center', // Centers items horizontally
            justifyContent: 'center', // Centers items vertically if space is available
            flexGrow: 1, // Ensures FlatList uses full available height
          }}
          data={cars}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Vehicle vehicle={item} setter_vehicles={setCars} />
          )}/>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("Create Vehicle")}
        className="absolute bottom-0 right-5 z-50"
      >
        <Entypo name="squared-plus" size={64} color="blue" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default VehiclesScreen;
