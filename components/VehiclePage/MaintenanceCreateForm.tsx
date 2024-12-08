import { SafeAreaView, Text, Touchable, TouchableOpacity, View } from "react-native"
import { useEffect, useState } from "react"
import { FAB, TextInput } from "react-native-paper"
import { DatePickerInput } from "react-native-paper-dates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function MaintenanceCreateForm(props) {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState(new Date());   
    const [textDisabled, setTextDisabled] = useState(true);

    const checkDisabled = () => {
        setTextDisabled(title === '' || description === '' || price === '' || date === null);
    }

    useEffect(()=>{
        checkDisabled();
    }, [title, description, price, date])

    const handleInputPrice = (text) => {
        const sanitizedText = text.replace(/[^0-9.]/g, "");

        // Ensure only one decimal point
        const validText = sanitizedText.replace(/(\..*?)\..*/g, "$1");

        setPrice(validText);
        
      };

      async function addMaintenance(){
        var storedMaintenance = await AsyncStorage.getItem('maintenance');
        
        if (storedMaintenance === null) {
            storedMaintenance = [];
        } else {
            storedMaintenance = JSON.parse(storedMaintenance);
        }
        console.warn("fnesi", props.route.params)
        console.log(storedMaintenance);
        storedMaintenance.push({title: title, description: description, price: price, date: date, vehicle_id: props.route.params.vehicle_id});
        AsyncStorage.setItem('maintenance', JSON.stringify(storedMaintenance)).then(()=>{
            navigation.goBack();
        })
        
    }

    return (
        <SafeAreaView className="h-full w-full mb-[62px] bg-white my-auto">
            <View className="mt-8">
            <Text className="mx-auto p-2 text-2xl font-bold">Maintenance</Text>
            </View>
            <View className="mt-8 w-11/12 mx-auto">
            <TextInput
                placeholder="Title"
                label="Title"
                value={title}
                mode="outlined"
                onChangeText={text => setTitle(text)}
                />
            <TextInput
                className="mt-4 h-72 text-start"
                multiline={true}
                placeholder="Description"
                label="Description"
                value={description}
                mode="outlined"
                onChangeText={text => setDescription(text)}
                />
            <TextInput
                className="mt-4"
                placeholder="price"
                label="Price"
                value={price}
                mode="outlined"
                keyboardAppearance="default"
                keyboardType="numeric"
                onChangeText={handleInputPrice}
                onBlur={()=>setPrice(parseFloat(price).toFixed(2))}
                />
                <DatePickerInput
                className="mt-24"
                locale="pt-pt"
                label={"Date"}
                value={date}
                mode="outlined"
                presentationStyle="overFullScreen"
                onChange={(setDate)}
                inputMode="start"></DatePickerInput>

            <View className="mt-24 w-full mx-auto">
                    <FAB icon="plus" disabled={textDisabled} onPress={addMaintenance} mode="elevated" label="Register Maintenance"></FAB>
            </View>
            </View>
            
        </SafeAreaView>
    )
}