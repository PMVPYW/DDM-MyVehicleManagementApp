import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContributionGraph, LineChart, PieChart } from 'react-native-chart-kit';

const Dashboard = (props) => {
  const navigation = useNavigation();
  const [vehicles, setVehicles] = useState([]);
  const [Maintenances, setMaintenances] = useState([]);

  const [vehicleEvo, setVehicleEvo] = useState([]);
  const [vehicleEvoLabels, setVehicleEvoLabels] = useState([]);

  const [spentMaintenance, setSpentMaintenance] = useState([]);
  const [spentMaintenanceLabels, setSpentMaintenanceLabels] = useState([]);
  const [contributionsMaintenance, setContributionsMaintenance] = useState([]);


  const [BrandDistribution, setBrandDistribution] = useState([]);

  useEffect(() => {
    const loadCars = async () => {
      //load cars from async storage
      const cars = await AsyncStorage.getItem('vehicles');
      if (cars) {
        const models = [];
        const parsed_cars = JSON.parse(cars)
        for (var i = 0; i < parsed_cars.length; i++) {
          const car = parsed_cars[i];
          const data = await fetch(
            `https://www.carqueryapi.com/api/0.3?cmd=getModel&model=${car.model_id}`
          )
          const model = await data.json();
          
          model[0].id = car.id;
          model[0].created_at = car.created_at;
          model[0].deleted_at = car.deleted_at;
          models.push({...model[0]});
          console.warn(model[0], "mdls-2")
        };
        console.warn(models, "mdls")
        
        setVehicles(models);
      }
    };
    loadCars();

    const loadMaintenances = async () => {
      //load maintenances from async storage
      const maintenances = await AsyncStorage.getItem('maintenance');
      if (maintenances) {
        setMaintenances(JSON.parse(maintenances));
      }
    };
    loadMaintenances();
  }, []);

  useEffect(() => {
    console.warn(vehicleEvo, "vehicleEvo")
  }, [vehicleEvo]);

  useEffect(() => {

    const dateSortFunction = (a, b) => {
      // Convert DD/MM/YYYY to MM/DD/YYYY before creating Date objects
      const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day); // Month is 0-based in JS Date
      };
      return parseDate(a) - parseDate(b);
    }

    //vehicle evo
    const sorted_cars = vehicles.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    const chart_data = [];
    const mapper = {};
    vehicles.forEach((car) => { 
      if (!mapper[new Date(car.created_at).toLocaleDateString()]) {
        mapper[new Date(car.created_at).toLocaleDateString()] = 1;
      } else {
        mapper[new Date(car.created_at).toLocaleDateString()] += 1;
      }
      if (car.deleted_at != undefined) {
        if (!mapper[new Date(car.deleted_at).toLocaleDateString()]) {
          mapper[new Date(car.deleted_at).toLocaleDateString()] = -1;
        } else {
          mapper[new Date(car.deleted_at).toLocaleDateString()] -= 1;
        }
      }
      console.warn(Object.keys(car), car.deleted_at,"deletion")
    });
    setVehicleEvoLabels(Object.keys(mapper).sort(dateSortFunction));
    console.warn(mapper, "mapper")
    var sum = 0;
    Object.keys(mapper).sort(dateSortFunction).forEach((key) => {
      sum += mapper[key];
      chart_data.push(sum);
    });
    console.warn(mapper, "chart_data")
    if (chart_data.length > 1 || (chart_data.length === 1 && chart_data[0] !== 0)) {
    {
      setVehicleEvo([...chart_data])
    }

    //brand distribution
    const brandMapper = {};
    vehicles.forEach((car) => {
      if (!brandMapper[car.make_display]) {
        brandMapper[car.make_display] = 1;
      } else {
        brandMapper[car.make_display] += 1;
      }
    });
    const brandDistribution = [];
    const totalBrands = Object.keys(brandMapper).length;
    const colorPalette = generateColorPalette(totalBrands); 
    Object.keys(brandMapper).forEach((key) => {
      brandDistribution.push({name: key, count: brandMapper[key], color: colorPalette.pop(), legendFontColor: "#FFF", legendFontSize: 15});
    }); 
    setBrandDistribution(brandDistribution);
    console.warn(brandDistribution, "brandDistribution")
  }
  }, [vehicles]);

  useEffect(() => {
    //money spent in maintenance
    const mapper = {};
    const contributionMapper = {};
    Maintenances.forEach((maintenance) => {
      if (!mapper[new Date(maintenance.date).toLocaleDateString()]) {
        mapper[new Date(maintenance.date).toLocaleDateString()] = parseFloat(maintenance.price);
      } else {
        mapper[new Date(maintenance.date).toLocaleDateString()] += parseFloat(maintenance.price);
      }

      if (!contributionMapper[new Date(maintenance.date).toLocaleDateString()]) {
        contributionMapper[new Date(maintenance.date).toLocaleDateString()] = 1;
      } else {
        contributionMapper[new Date(maintenance.date).toLocaleDateString()] += 1;
      }
    });
    setSpentMaintenanceLabels(Object.keys(mapper));
    setSpentMaintenance(Object.values(mapper));
    const contributions = []
    Object.keys(contributionMapper).forEach((key) => {
      const [day, month, year] = key.split("/");

      contributions.push({date: `${year}-${month}-${day}`, count: contributionMapper[key]});
    });
    console.warn(contributions, "contributions")
    setContributionsMaintenance(contributions);
  }, [Maintenances]);

  const generateColorPalette = (count) => {
    const colors = [];
    const hueStep = 360 / count; // Distribute colors evenly across the hue spectrum
    for (let i = 0; i < count; i++) {
      const hue = Math.round(i * hueStep);
      colors.push(`hsl(${hue}, 70%, 50%)`); // Use HSL for vibrant colors
    }
    return colors;
  };

  return (
    <View style={styles.container}>
      {vehicles.length == 0 ? <><Text style={styles.text}>Home Screen</Text>
        <Button
          title="Go to Vehicles"
          onPress={() => navigation.navigate('Garage')}
        /></> :
          <ScrollView className="h-full w-full" contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1, // Ensure content stretches to fill the ScrollView
          }}>
            
      <View className="mt-4 mx-auto">
        {lineChart({title: "Vehicle Evolution", labels: vehicleEvoLabels, data: vehicleEvo})}
        {lineChart({title: "Money Spent in Maintenance", labels: spentMaintenanceLabels, data: spentMaintenance})}
        {contributionMap({data: contributionsMaintenance, title: "Maintenance Heatmap"})}
        {PieChartChart({title: "Brand Distribution", data: BrandDistribution})}
      </View>
    </ScrollView>
    }
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});


function PieChartChart(props) {
  console.log(props.data, "props.data")
  return <View className="mx-auto mt-4">
  <Text className="mx-auto text-lg font-bold">{props.title}</Text>
    <PieChart data={props.data} 
height={220} width={Dimensions.get("window").width * 11/12} accessor={"count"} backgroundColor='#5858ff' 
    chartConfig={{
      backgroundColor: "#0000ff",
      backgroundGradientFrom: "#8080ff",
      backgroundGradientTo: "#5858FF",
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#0000ff"
      }
    }}
    />
  </View>
}

function lineChart(props) {
  return <View className="mx-auto mt-4">
  <Text className="mx-auto text-lg font-bold">{props.title}</Text>
<LineChart data={{
labels: props.labels.length > 0 ? props.labels : [new Date().toLocaleDateString()],
datasets: [
{
data: props.data.length > 0 ? props.data : [0]
}
]
}}
width={Dimensions.get("window").width * 11/12} // from react-native
height={220}

chartConfig={{
backgroundColor: "#0000ff",
backgroundGradientFrom: "#8080ff",
backgroundGradientTo: "#5858FF",
color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
style: {
borderRadius: 16
},
propsForDots: {
r: "6",
strokeWidth: "2",
stroke: "#0000ff"
}
}}
/>
</View>
}

function contributionMap(props) {
  return <View className="mt-4">
    <Text className="mx-auto text-lg font-bold">{props.title}</Text>
    <ContributionGraph
  values={props.data}
  endDate={new Date()}
  numDays={105}
  width={Dimensions.get("window").width * 11/12}
  height={220}
  chartConfig={{
    backgroundColor: "#0000ff",
    backgroundGradientFrom: "#8080ff",
    backgroundGradientTo: "#5858FF",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#0000ff"
    }
  }}
/></View>
}

export default Dashboard;
