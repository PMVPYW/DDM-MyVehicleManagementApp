import {useCallback, useEffect, useState} from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Touchable, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import DoubleSlider from '../common/double_slider/DoubleSlider';
import Row from './Row';


async function SaveCar(model, nav){
    try {
    var next_id = await AsyncStorage.getItem('last_id')
    next_id == null ? next_id = 0 : next_id = Number.parseInt(next_id) + 1
    AsyncStorage.setItem('last_id', next_id.toString())
    var response = await fetch('https://www.carqueryapi.com/api/0.3?cmd=getModel&model=' + model.id)
      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
          return '[{"ExtColors":[],"IntColors":[]}]'
      }
      const car_data = await response.json();
      const data_to_save = {id: next_id, model_id: car_data[0].model_id, created_at: new Date()}
      var val = await AsyncStorage.getItem('vehicles')
      const new_data = val ? [...JSON.parse(val), {...data_to_save}] : [{...data_to_save}]; // Handle case if 'vehicles' is null
      await AsyncStorage.setItem('vehicles', JSON.stringify(new_data))
      nav.navigate('My Vehicles', {rerender: new Date().getTime()})
  } catch (error) {
    console.error(error)
  }
}

const CreateVehicle = () => {
      const navigation = useNavigation();

      const [year, setYear] = useState();
      const [make, setMake] = useState();
      const [body, setBody] = useState('')
      const [doors, setDoors] = useState('')
      const [drive, setDrive] = useState('')
      const [fuel, setFuel] = useState('')
      const [powerInterval, setPowerInterval] = useState([0, 999])
      const [model, setModel] = useState({})

      interface date_limits {min_year: number, max_year: number}

      var limits :date_limits = {min_year: 0, max_year: 0};
      const [years, setYears] = useState([])
      const [makes, setMakes] = useState([])
      const [models, setModels] = useState([])
      //get years
      useEffect(()=>{
        fetch('https://www.carqueryapi.com/api/0.3?cmd=getYears').then(response => {
          // Check if the response is okay (status in the range 200-299)
          if (!response.ok) {
              return '{ "Years": {"min_year":"0", "max_year":"0"}'
          }
          return response.json();
      })
      .then(jsonData => {
          limits.min_year = Number.parseInt(jsonData.Years.min_year)
          limits.max_year =  Number.parseInt(jsonData.Years.max_year)
          const arr = []
          for (var i = limits.max_year; i >= limits.min_year; i--)
          {
            arr.push(i)
          }
          setYears([...arr])
          setYear(limits.max_year)
      })
      }, [])
      //get makes by year
      useEffect(()=>{
        fetch(`https://www.carqueryapi.com/api/0.3?cmd=getMakes&year=${year}`).then(response => {
          // Check if the response is okay (status in the range 200-299)
          if (!response.ok) {
              return '{ "Makes": {"min_year":"0", "max_year":"0"} }'
          }
          return response.json();
      })
      .then(jsonData => {
          setMakes(jsonData.Makes ?? [])
          setMake(jsonData.Makes.length > 0 ? jsonData.Makes[0].make_id : {})
      })
      }, [year])

      //get models by filters
      useEffect(()=>{
          fetch(`https://www.carqueryapi.com/api/0.3?cmd=getTrims&year=${year}&make=${make}&body=${body}&doors=${doors}&drive=${drive}&fuel=${fuel}&min_power=${powerInterval[0]}&max_power=${powerInterval[1]}`).then(response => {
            // Check if the response is okay (status in the range 200-299)
            if (!response.ok) {
                return '{"Trims":[]}'
            }
            return response.json();
        })
        .then(jsonData => {
            setModels(jsonData.Trims ?? [])
            setModel(jsonData.Trims.length > 0 ? {id: jsonData.Trims[0].model_id} : {id: -1})
        })
      }, [year, make, body, doors, drive, fuel, powerInterval]);

      return (
        <SafeAreaView className="h-full w-full mb-[62px] bg-white my-auto">
          <ScrollView className="mt-8">
            <View className="">
              <Text className="mx-auto p-2 text-2xl font-bold">Search Vehicle</Text>
            </View>
            <View className="w-11/12 mt-2 mx-auto h-full flex flex-col space-x-2 items-center">
              <Row>
                <View className="w-1/3">
                  <Text className="ml-2 text-xl font-bold">Year</Text>
                  <View className="rounded-xl border-black border-2 bg-gray-200">
                    <Picker
                      selectedValue={year}
                      onValueChange={(itemValue, itemIndex) =>
                        setYear(itemValue)
                      }>
                        {years.map((year) => <Picker.Item label={year} key={year} value={year} />)}
                    </Picker>
                  </View>
                </View>    
                <View className="w-1/2">
                  <Text className="ml-2 text-xl font-bold">Brand</Text>
                  <View className="rounded-xl border-black border-2 bg-gray-200">
                    <Picker
                      selectedValue={make}
                      onValueChange={(itemValue, itemIndex) =>
                        setMake(itemValue)
                      }>
                        {makes.map((make) => <Picker.Item label={make.make_display} key={make.make_id} value={make.make_display} />)}
                    </Picker>
                  </View>
                </View> 
              </Row>
              <Row>
                <View className="w-1/3">
                    <Text className="ml-2 text-xl font-bold">Doors</Text>
                    <View className="rounded-xl border-black border-2 bg-gray-200">
                      <Picker
                        selectedValue={doors}
                        onValueChange={(itemValue, itemIndex) =>
                          setDoors(itemValue)
                        }>
                          <Picker.Item label={'Any'} key={''} value={''}/>
                          <Picker.Item label={1} key={1} value={1}/>
                          <Picker.Item label={2} key={2} value={2}/>
                          <Picker.Item label={3} key={3} value={3}/>
                          <Picker.Item label={4} key={4} value={4}/>
                          <Picker.Item label={5} key={5} value={5}/>
                      </Picker>
                    </View>
                  </View>
                  <View className="w-1/2">
                    <Text className="ml-2 text-xl font-bold">Body</Text>
                    <View className="rounded-xl border-black border-2 bg-gray-200">
                      <Picker
                        selectedValue={body}
                        onValueChange={(itemValue, itemIndex) =>
                          setBody(itemValue)
                        }>
                          <Picker.Item label={'Any'} key={''} value={''}/>
                          <Picker.Item label={'coupe'} key={'coupe'} value={'coupe'}/>
                          <Picker.Item label={'Hatchback'} key={'Hatchback'} value={'Hatchback'}/>
                          <Picker.Item label={'Convertible'} key={'Convertible'} value={'Convertible'}/>
                          <Picker.Item label={'SUV'} key={'SUV'} value={'SUV'}/>
                          <Picker.Item label={'Crossover'} key={'Crossover'} value={'Crossover'}/>
                          <Picker.Item label={'Minivan'} key={'Minivan'} value={'Minivan'}/>
                          <Picker.Item label={'Pickup'} key={'Pickup'} value={'Pickup'}/>
                          <Picker.Item label={'Van'} key={'Van'} value={'Van'}/>
                          <Picker.Item label={'Sport Utility'} key={'Sport Utility'} value={'Sport Utility'}/>
                          <Picker.Item label={'Compact'} key={'Compact'} value={'Compact'}/>
                          <Picker.Item label={'Midsize'} key={'Midsize'} value={'MidSize'}/>
                      </Picker>
                    </View>
                  </View>        
              </Row>
              <Row>
                <View className="w-1/3">
                  <Text className="ml-2 text-xl font-bold">Drive</Text>
                  <View className="rounded-xl border-black border-2 bg-gray-200">
                    <Picker
                      selectedValue={drive}
                      onValueChange={(itemValue, itemIndex) =>
                        setDrive(itemValue)
                      }>
                        <Picker.Item label={'Any'} key={''} value={''}/>
                        <Picker.Item label={'FWD'} key={'Front'} value={'Front'}/>
                        <Picker.Item label={'RWD'} key={'Rear'} value={'Rear'}/>
                        <Picker.Item label={'4WD'} key={'4WD'} value={'4WD'}/>
                        <Picker.Item label={'AWD'} key={'AWD'} value={'AWD'}/>
                    </Picker>
                  </View>
                </View>
                <View className="w-1/2">
                  <Text className="ml-2 text-xl font-bold">Fuel</Text>
                  <View className="rounded-xl border-black border-2 bg-gray-200">
                    <Picker
                      selectedValue={fuel}
                      onValueChange={(itemValue, itemIndex) =>
                        setFuel(itemValue)
                      }>
                        <Picker.Item label={'Any'} key={''} value={''}/>
                        <Picker.Item label={'Diesel'} key={'Diesel'} value={'Diesel'}/>
                        <Picker.Item label={'Gasoline'} key={'Gasoline'} value={'Gasoline'}/>
                    </Picker>
                  </View>
                </View>
              </Row>
              <Row>
                <DoubleSlider limits={powerInterval} new_value_callback={(val)=>{setPowerInterval(val)}} min={0} max={300} title='HorsePower'></DoubleSlider>
              </Row>
              <Row>
              <View className="w-11/12">
                  <Text className="ml-2 text-xl font-bold">Model</Text>
                  <View className="rounded-xl border-black border-2 bg-gray-200">
                    <Picker
                      selectedValue={model.id}
                      onValueChange={(itemValue, itemIndex) =>
                        setModel({id: itemValue})
                      }>
                        {models.map((m) => <Picker.Item label={m.model_name + m.model_trim} key={m.model_id} value={m.model_id} />)}
                    </Picker>
                  </View>
                </View>
              </Row>
              <Row>
                <TouchableOpacity onPress={()=>{SaveCar(model, navigation)}} disabled={Object.keys(model).length == 0} className="w-11/12 rounded-xl p-4 mt-4" style={{backgroundColor: Object.keys(model).length == 0 ? 'gray' : 'blue'}}>
                    <Text className="text-white text-center text-xl font-bold">Add Vehicle</Text>
                </TouchableOpacity>
              </Row>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
};


export default CreateVehicle;
