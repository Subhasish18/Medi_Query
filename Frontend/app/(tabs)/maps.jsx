// src/screens/Maps.jsx
import React, { useState, useEffect, useCallback } from "react";
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
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
];

export default function Maps() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [region, setRegion] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const radius = 5000; // 5 km
  const MAX_RESULTS = 100;

  const buildOverpassQuery = (lat, lon, r) => {
    const clauses = [
      'node["amenity"="pharmacy"]',
      'way["amenity"="pharmacy"]',
      'node["shop"="chemist"]',
      'way["shop"="chemist"]',
      'node["shop"="drugstore"]',
      'way["shop"="drugstore"]',
      'node["healthcare"="pharmacy"]',
      'way["healthcare"="pharmacy"]',
    ];
    return `[out:json][timeout:25];
(
  ${clauses.map((c) => `${c}(around:${r},${lat},${lon});`).join("\n  ")}
);
out center ${MAX_RESULTS};`;
  };

  const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  };

  const fetchPlaces = useCallback(async (lat, lon, r) => {
    try {
      const query = buildOverpassQuery(lat, lon, r);
      const res = await fetchWithTimeout(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `data=${encodeURIComponent(query)}`,
        },
        15000
      );

      if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);
      const json = await res.json();

      const elements = (json.elements || [])
        .slice(0, MAX_RESULTS)
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
      Alert.alert(
        "Error",
        err.name === "AbortError"
          ? "Request timed out. Please try again."
          : "Unable to fetch nearby medicine shops."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const getLocationAndFetch = useCallback(async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is required to find nearby medical shops."
        );
        setLoading(false);
        return;
      }

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

  useEffect(() => {
    getLocationAndFetch();
  }, []);

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

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header with Refresh Button */}
      <View style={styles.headerRow}>
        <Text style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
          Nearest Medical Shops
        </Text>
        <TouchableOpacity onPress={getLocationAndFetch} style={styles.refreshBtn}>
          <Ionicons name="refresh-circle" size={30} color={isDark ? "#fff" : "#0EA5A4"} />
        </TouchableOpacity>
      </View>

      {/* Map Section */}
      {region && (
        <View style={styles.innerContainer}>
          <MapView
            style={styles.map}
            region={region}
            showsUserLocation
            showsMyLocationButton
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
                onPress={() => setSelectedPlace(p)}
              >
                <View style={styles.marker}>
                  <Text style={styles.markerText}>💊</Text>
                </View>
              </Marker>
            ))}
          </MapView>

          {selectedPlace && Platform.OS === "ios" && (
            <TouchableOpacity style={styles.fab} onPress={openInMaps}>
              <Text style={styles.fabText}>
                Directions to {selectedPlace.tags?.name || "Pharmacy"} ➡️
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Single unified loader */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={isDark ? "#fff" : "#007AFF"} />
          <Text style={{ marginTop: 8, color: isDark ? "#fff" : "#333" }}>
            Loading nearby medicine shops...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 12,
  },
  header: { fontSize: 22, fontWeight: "700" },
  innerContainer: { flex: 1, borderRadius: 12, overflow: "hidden" },
  map: { flex: 1 },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 20,
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
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e11d48",
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: { color: "#fff", fontWeight: "bold" },
  darkBg: { backgroundColor: "#121212" },
  lightBg: { backgroundColor: "#F0FDF4" },
  headerLight: { color: "#1F2937" },
  headerDark: { color: "#F3F4F6" },
  refreshBtn: { marginRight: 4 },
});
