// src/screens/Maps.jsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  Alert,
  Platform,
  TouchableOpacity,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { IconSymbol } from "@/components/ui/icon-symbol";

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
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
  const [selectedPlace, setSelectedPlace] = useState(null);

  const radius = 5000; // 5 km

  const buildOverpassQuery = (lat, lon, r) => {
    const clauses = [
      'node["amenity"="pharmacy"]',
      'way["amenity"="pharmacy"]',
      'node["shop"="chemist"]',
      'way["shop"="chemist"]',
      'node["shop"="pharmacy"]',
      'way["shop"="pharmacy"]',
      'node["shop"="drugstore"]',
      'way["shop"="drugstore"]',
      'node["shop"="medical"]',
      'way["shop"="medical"]',
      'node["healthcare"="pharmacy"]',
      'way["healthcare"="pharmacy"]',
      'node["dispensing"="yes"]',
      'way["dispensing"="yes"]',
    ];

    const data = `[out:json][timeout:25];
(
  ${clauses.map((c) => `${c}(around:${r},${lat},${lon});`).join("\n  ")}
);
out center;`;
    return encodeURIComponent(data);
  };

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
          if (el.type === "node")
            return { id: el.id, lat: el.lat, lon: el.lon, tags: el.tags || {} };
          if (el.type === "way" && el.center)
            return {
              id: el.id,
              lat: el.center.lat,
              lon: el.center.lon,
              tags: el.tags || {},
            };
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

  const getLocationAndFetch = useCallback(async () => {
    setLoading(true);

    if (Platform.OS === "ios") {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status === "denied") {
        Alert.alert(
          "Location Permission Required",
          "You previously denied location access. Please enable it in Settings to find nearby medical shops.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        setLoading(false);
        return;
      }

      if (status !== "granted") {
        const request = await Location.requestForegroundPermissionsAsync();
        if (request.status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Location permission is required to find nearby medical shops."
          );
          setLoading(false);
          return;
        }
      }
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is required to find nearby medical shops."
        );
        setLoading(false);
        return;
      }
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
  }, [fetchPlaces]);

  useFocusEffect(
    useCallback(() => {
      getLocationAndFetch();
    }, [getLocationAndFetch])
  );

  const openInMaps = () => {
    if (!selectedPlace) return;
    const { lat, lon, tags } = selectedPlace;
    const label = tags?.name || "Pharmacy";
    const scheme =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${lat},${lon}&dirflg=d`
        : `geo:0,0?q=${lat},${lon}(${label})`;
    Linking.openURL(scheme).catch(() =>
      Alert.alert("Error", "Could not open maps app.")
    );
  };

  if (!region) {
    return (
      <SafeAreaView
        style={[styles.center, isDark ? styles.darkBg : styles.lightBg]}
        edges={["top", "left", "right"]}
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
      edges={["top", "left", "right", "bottom"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <Text
        style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}
      >
        Nearest Medical Shops
      </Text>

      <View style={styles.innerContainer}>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation
          showsMyLocationButton
          customMapStyle={isDark ? DARK_MAP_STYLE : []}
          provider={
            Platform.OS === "android" ? MapView.PROVIDER_GOOGLE : undefined
          }
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
              onPress={() => setSelectedPlace(p)}
            >
              <IconSymbol name="cross.case.fill" size={28} color="#e11d48" />
            </Marker>
          ))}
        </MapView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator
              size="large"
              color={isDark ? "#fff" : "#007AFF"}
            />
            <Text style={{ marginTop: 8, color: isDark ? "#fff" : "#333" }}>
              Loading nearby medicine shops...
            </Text>
          </View>
        )}

        {Platform.OS === "ios" && selectedPlace && (
          <TouchableOpacity style={styles.fab} onPress={openInMaps}>
            <Text style={styles.fabText}>
              Directions to {selectedPlace.tags?.name || "Pharmacy"} ➡️
            </Text>
          </TouchableOpacity>
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
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 4,
  },
  fabText: { color: "#fff", fontWeight: "bold" },
  darkBg: { backgroundColor: "#121212" },
  lightBg: { backgroundColor: "#F0FDF4" },
  header: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "left",
    marginTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  headerLight: {
    color: "#1F2937", // dark gray for light mode
  },
  headerDark: {
    color: "#F3F4F6", // light gray/white for dark mode
  },
});
