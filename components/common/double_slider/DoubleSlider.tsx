import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';


const DoubleSlider = (props) => {
  const [customValue, setCustomValue] = useState(props.limits);

  const [layout, setLayout] = useState({width: 0, height: 0});

  const handleCustomSliderChange = value => {
    props.new_value_callback(value);
  };
  

  return (
    <View className="w-full flex items-center justify-center" onLayout={(event)=>{setLayout(event.nativeEvent.layout)}}>

      <Text style={styles.title}>{props.title}</Text>
      <MultiSlider
        values={customValue}
        onValuesChange={handleCustomSliderChange}
        sliderLength={layout.width * 0.85}
        min={props.min}
        max={props.max}
        step={1}
        allowOverlap={false}
        snapped={true}
        customMarker={props => {
          return (
            <View style={styles.customMarker}>
              <Text style={styles.customMarkerText}>{props.currentValue}</Text>
            </View>
          );
        }}
        customMarkerLeft={props => {
          return (
            <View style={styles.customMarker}>
              <Text style={styles.customMarkerText}>{props.currentValue}</Text>
            </View>
          );
        }}
        customMarkerRight={props => {
          return (
            <View style={styles.customMarker}>
              <Text style={styles.customMarkerText}>{props.currentValue}</Text>
            </View>
          );
        }}
        selectedStyle={{ backgroundColor: 'blue' }}
        unselectedStyle={{ backgroundColor: 'silver' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  customMarker: {
    backgroundColor: 'blue',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'blue',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customMarkerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DoubleSlider;