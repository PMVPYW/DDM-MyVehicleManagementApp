import {useEffect, useState} from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

const CreateVehicle = () => {
  const navigation = useNavigation();

  const [year, setYear] = useState();
  const [make, setMake] = useState();

  interface date_limits {min_year: number, max_year: number}

  var limits :date_limits = {min_year: 0, max_year: 0};
  const [years, setYears] = useState([])
  const [makes, setMakes] = useState([])

  useEffect(()=>{
    fetch('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getYears').then(response => {
      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
          return '?({ "Years": {"min_year":"0", "max_year":"0"} });'
      }
      return response.text();
  })
  .then(data => {
      const jsonData = JSON.parse(data.slice(data.indexOf('(') + 1, data.lastIndexOf(')')));
      limits.min_year = Number.parseInt(jsonData.Years.min_year)
      limits.max_year =  Number.parseInt(jsonData.Years.max_year)
      const arr = []
      for (var i = limits.max_year; i >= limits.min_year; i--)
      {
        arr.push(i)
      }
      setYears([...arr])
  })
  }, [])

  useEffect(()=>{
    fetch(`https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes&year=${year}`).then(response => {
      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
          return '?({ "Makes": {"min_year":"0", "max_year":"0"} });'
      }
      return response.text();
  })
  .then(data => {
      const jsonData = JSON.parse(data.slice(data.indexOf('(') + 1, data.lastIndexOf(')')));
      setMakes(jsonData.Makes)
  })
  }, [year])

  return (
    <SafeAreaView className="h-full w-full mb-[62px] bg-white">
      <View className="mt-8">
        <Text className="mx-auto p-2 text-2xl font-bold">Pesquisar Veículo</Text>
      </View>
      <View className="w-11/12 mt-2 mx-auto h-full flex flex-row space-x-2 justify-center">
        <View className="w-1/3">
          <Text className="ml-2 text-xl font-bold">Ano</Text>
          <View className="rounded-xl border-black border-2 bg-gray-200">
            <Picker
              selectedValue={year}
              onValueChange={(itemValue, itemIndex) =>
                setYear(itemValue)
              }>
                {years.map((year) => <Picker.Item label={year} value={year} />)}
            </Picker>
          </View>
        </View>    
        <View className="w-1/2">
          <Text className="ml-2 text-xl font-bold">Marca</Text>
          <View className="rounded-xl border-black border-2 bg-gray-200">
            <Picker
              selectedValue={make}
              onValueChange={(itemValue, itemIndex) =>
                setMake(itemValue)
              }>
                {makes.map((make) => <Picker.Item label={make.make_display} value={make.make_display} />)}
            </Picker>
          </View>
        </View> 
      </View>
    </SafeAreaView>
  );
};


export default CreateVehicle;
