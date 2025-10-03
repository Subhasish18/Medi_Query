import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Med from "../../components/med";

export default function HomeScreen() {
  const colorScheme = useColorScheme(); // light or dark
  const isDark = colorScheme === "dark";
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        console.log("📱 Expo Push Token:", token); // <-- log token
      }
    });
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#F0FDF4" },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText
          style={[styles.title, { color: isDark ? "#fff" : "#1E293B" }]}
        >
          Home Screen
        </ThemedText>

        <ThemedText style={{ fontSize: 14, marginBottom: 8, color: isDark ? "#aaa" : "#555" }}>
          {expoPushToken ? `Push Token: ${expoPushToken}` : "Fetching token..."}
        </ThemedText>

        {/* Med Component wrapped to scroll if overflowing */}
        <ThemedView style={styles.medContainer}>
          <Med />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Permission required", "Failed to get push token for notifications!");
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert("Physical device required", "Push Notifications only work on a real device");
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  medContainer: {
    marginTop: 20,
    flex: 1,
    backgroundColor: "transparent",
  },
});
