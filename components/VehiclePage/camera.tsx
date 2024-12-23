import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker

export default function FullScreenCamera(props) {
    const navigation = useNavigation();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [flash, setFlash] = useState('auto');
    const [ready, setReady] = useState(false);
    const appFolder = `${FileSystem.documentDirectory}MyVehicleManagementApp_photos/`;
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        // Create a dedicated folder for your app's photos
        const createFolder = async () => {
            const folderInfo = await FileSystem.getInfoAsync(appFolder);
            if (!folderInfo.exists) {
                await FileSystem.makeDirectoryAsync(appFolder, { intermediates: true });
            }
        };

        createFolder();
    }, []);

    function toogleFlash() {
        setFlash(current => {
            if (current === 'auto') {
                return 'on';
            } else if (current === 'on') {
                return 'off';
            } else {
                return 'auto';
            }
        });
    }

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View>
                <Text>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    function takePicture() {
        if (!ready) {
            return;
        }
        cameraRef.current.takePictureAsync().then((photo) => {
            const newPhotoUri = `${appFolder}${Date.now()}.jpg`;
            FileSystem.moveAsync({
                from: photo.uri,
                to: newPhotoUri,
            }).then(() => {
                AsyncStorage.getItem('vehicles').then((val) => {
                    const new_data = JSON.parse(val);
                    const index = new_data.findIndex((vehicle) => vehicle.id === props.route.params.vehicle_id);
                    if (index !== -1) {
                        new_data[index].photo = newPhotoUri;
                    }
                    AsyncStorage.setItem('vehicles', JSON.stringify(new_data)).then(() => {
                        props.route.params.photo_setter(newPhotoUri);
                        navigation.goBack();
                    });
                });
            });
        });
    }

    // Function to handle image picking
    const pickImage = async () => {
        // Request permission to access the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            // Do something with the selected image
            const selectedImageUri = result.assets[0].uri;
            const newPhotoUri = `${appFolder}${Date.now()}.jpg`;
            await FileSystem.moveAsync({
                from: selectedImageUri,
                to: newPhotoUri,
            });
            // Update AsyncStorage or navigate as needed
            AsyncStorage.getItem('vehicles').then((val) => {
                const new_data = JSON.parse(val);
                const index = new_data.findIndex((vehicle) => vehicle.id === props.route.params.vehicle_id);
                if (index !== -1) {
                    new_data[index].photo = newPhotoUri;
                }
                AsyncStorage.setItem('vehicles', JSON.stringify(new_data)).then(() => {
                    props.route.params.setter_vehicles([...new_data])
                    props.route.params.photo_setter(newPhotoUri);
                    navigation.goBack();
                });
            });
        }
    };

    return (
        <View className="w-full h-full">
            <CameraView className="w-full h-full" ref={cameraRef} onCameraReady={() => setReady(true)} facing={facing} mute={true}>
                <View className="absolute top-5 left-5">
                    <TouchableOpacity className="bg-white rounded-xl m-2" onPress={pickImage}>
                        <MaterialCommunityIcons name="folder" size={60} color="black" />
                    </TouchableOpacity>
                </View>
                <View className="absolute w-full bottom-5 flex-row justify-evenly">
                    <TouchableOpacity className="bg-white rounded-xl m-2" onPress={toggleCameraFacing}>
                        <MaterialCommunityIcons name="camera-flip" size={60} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white rounded-full p-2" onPress={takePicture}>
                        <MaterialCommunityIcons name="camera" size={60} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white rounded-xl m-2" onPress={toogleFlash}>
                        <MaterialCommunityIcons name={flash === 'auto' ? 'flash-auto' : (flash === 'on' ? 'flash' : 'flash-off')} size={60} color="black" />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}
