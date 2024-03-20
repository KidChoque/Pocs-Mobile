import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import {
  requestForegroundPermissionsAsync, //Request the access to your current location
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy, // Get the current Location
} from "expo-location";

// Shows the distance between two locations pointed in the map
import MapViewDirections from "react-native-maps-directions";

import { mapskey } from "./utils/mapsApiKey";

export default function App() {
  const mapReference = useRef(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const [finalPosition, setFinalPosition] = useState({
    latitude: -23.6521,
    longitude: -46.5273,
  });

  async function GetCurrentLocation() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const location = await getCurrentPositionAsync();

      // if (location && location.coords) {
        await setInitialPosition(location);
      // }
    }
  }
 
  useEffect(() => {
    GetCurrentLocation();

    // It keeps an eye on the location point in real time 
    watchPositionAsync({
      accuracy : LocationAccuracy.Highest,
      timeInterval : 1000,
      distanceInterval : 1, 
    }, async (response) => {
      await setInitialPosition(response) 
      mapReference.current?.animateCamera({
        pitch : 60 ,
        center : response.coords
      })
    })

  }, [1000]);

  useEffect(() => {
    ReloadMapView();
  }, [initialPosition]);

  async function ReloadMapView() {
    console.log(initialPosition);
    console.log(mapReference);
    
    if (mapReference.current && initialPosition) {
      await mapReference.current.fitToCoordinates([
        {
          latitude: initialPosition.coords.latitude,
          longitude: initialPosition.coords.longitude,
        },
        {
          latitude: finalPosition.latitude,
          longitude: finalPosition.longitude
        }],
        {
          edgePadding: { top: 60, right: 60, bottom : 60, left : 60 },
          animated: true
        }
      );
    }
  }

  return (
    <View style={styles.container}>
      {initialPosition != null ? (
        <MapView
          ref={mapReference}
          // Marca o ponto de início
          initialRegion={{
            latitude: initialPosition.coords.latitude,
            longitude: initialPosition.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          provider={PROVIDER_GOOGLE}
          customMapStyle={grayMapStyle}
          style={styles.map}
        >
          <Marker
            coordinate={{
              latitude: initialPosition.coords.latitude,
              longitude: initialPosition.coords.longitude,
            }}
            title="Initial Position"
            description="I'm here"
            pinColor="blue"
          />

          <MapViewDirections
            origin={initialPosition.coords}
            destination={{
              latitude: -23.6521,
              longitude: -46.5273,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            apikey={mapskey}
            strokeWidth={5}
            strokeColor="#E11D14"
          />

          <Marker
            coordinate={{
              latitude: -23.6521,
              longitude: -46.5273,
            }}
            title="Final Position"
            description="I'm there"
            pinColor="red"
          />
        </MapView>
      ) : (
        <>
          <Text></Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    width: "100%",
  },
});

const grayMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#E1E0E7",
      },
    ],
  },
  {
    elementType: "geometry.fill",
    stylers: [
      {
        saturation: -5,
      },
      {
        lightness: -5,
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#FBFBFB",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#33303E",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#66DA9F",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1B1B1B",
      },
    ],
  },
  {
    featureType: "road",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#C6C5CE",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#FBFBFB",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#ACABB7",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#8C8A97",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#8C8A97",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#8EA5D9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#fbfbfb",
      },
    ],
  },
];
