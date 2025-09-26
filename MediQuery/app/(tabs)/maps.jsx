// src/screens/Maps.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  Alert,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ better SafeArea
import { StatusBar } from "expo-status-bar"; // ✅ handles both platforms well

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
];

export default function Maps() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [region, setRegion] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const radius = 5000; // 5 km

  // Build Overpass query for pharmacies/medicine shops
  const buildOverpassQuery = (lat, lon, r) => {
    const clauses = [
      'node["amenity"="pharmacy"]',
      'way["amenity"="pharmacy"]',
      'node["shop"="chemist"]',
      'way["shop"="chemist"]',
      'node["shop"="pharmacy"]',
      'way["shop"="pharmacy"]',
      'node["healthcare"="pharmacy"]',
    ];

    const data = `[out:json][timeout:25];
(
  ${clauses.map((c) => `${c}(around:${r},${lat},${lon});`).join("\n  ")}
);
out center;`;
    return encodeURIComponent(data);
  };

  // Fetch places
  const fetchPlaces = useCallback(async (lat, lon, r) => {
    setLoading(true);
    try {
      const queryStr = buildOverpassQuery(lat, lon, r);
      const url = `https://overpass-api.de/api/interpreter?data=${queryStr}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);
      const json = await res.json();

      const elements = (json.elements || [])
        .map((el) => {
          if (el.type === "node") {
            return { id: el.id, lat: el.lat, lon: el.lon, tags: el.tags || {} };
          } else if (el.type === "way" && el.center) {
            return {
              id: el.id,
              lat: el.center.lat,
              lon: el.center.lon,
              tags: el.tags || {},
            };
          }
          return null;
        })
        .filter(Boolean);

      setPlaces(elements);
    } catch (err) {
      console.error("Fetch places error:", err);
      Alert.alert("Error", "Unable to fetch nearby medicine shops.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Get location
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Location permission is required to find nearby medical shops."
        );
        setLoading(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = loc.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        await fetchPlaces(latitude, longitude, radius);
      } catch (err) {
        console.error("Location error:", err);
        Alert.alert("Error", "Could not get location. Please try again.");
        setLoading(false);
      }
    })();
  }, [fetchPlaces]);

  if (!region) {
    return (
      <SafeAreaView
        style={[styles.center, isDark ? styles.darkBg : styles.lightBg]}
        edges={["top", "left", "right"]} // ✅ respects notches/dynamic island
      >
        <StatusBar style={isDark ? "light" : "dark"} />
        <ActivityIndicator size="large" color={isDark ? "#fff" : "#007AFF"} />
        <Text style={{ marginTop: 8, color: isDark ? "#fff" : "#333" }}>
          Fetching your location...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      edges={["top", "left", "right", "bottom"]} // ✅ cover all safe zones
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={styles.innerContainer}>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          customMapStyle={isDark ? DARK_MAP_STYLE : []}
          provider={Platform.OS === "android" ? MapView.PROVIDER_GOOGLE : undefined}
        >
          {places.map((p) => (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.lat, longitude: p.lon }}
              title={p.tags.name || "Medicine Shop"}
              description={
                p.tags["addr:street"] ||
                p.tags["operator"] ||
                "Pharmacy / Chemist nearby"
              }
              pinColor={"#FF0000"} // Always red
            />
          ))}
        </MapView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={isDark ? "#fff" : "#007AFF"} />
            <Text style={{ marginTop: 8, color: isDark ? "#fff" : "#333" }}>
              Loading nearby medicine shops...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1, paddingHorizontal: 8, paddingBottom: 8 },
  map: { flex: 1, borderRadius: 12, overflow: "hidden" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  darkBg: { backgroundColor: "#0b1220" },
  lightBg: { backgroundColor: "#ffffff" },
});
