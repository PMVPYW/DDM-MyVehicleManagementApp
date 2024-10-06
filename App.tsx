import 'react-native-gesture-handler';
import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './components/dashboard/dashboard';
import VehiclesScreen from './components/vehicles/Vehicles';
import CreateVehicle from './components/create_vehicle/CreateVehicle';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (  
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline'; // Example icon names
              color = focused ? 'blue' : 'gray'
            } else if (route.name === 'CreateVehicle') {
              iconName = focused ? 'add-circle' : 'add-circle-outline'; // Example icon names
              color = focused ? 'blue' : 'gray'
            } 
            else if (route.name === 'Vehicles') {
              iconName = focused ? 'car-sport' : 'car-sport-outline'; // Example icon names
              color = focused ? 'blue' : 'gray'
            }

            return <Ionicons name={iconName} size={32} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {margin: 6,
            borderRadius: 12,
            height: 56
          },
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={Dashboard    } 
          options={{ headerShown: false }} // Hide header for the tab screens
        />
        <Tab.Screen 
          name="CreateVehicle" 
          component={CreateVehicle} 
          options={{ headerShown: true }} // Hide header for the tab screens
        />
        <Tab.Screen 
          name="Vehicles" 
          component={VehiclesScreen} 
          options={{ headerShown: false }} // Hide header for the tab screens
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
