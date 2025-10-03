import React from "react";
import {
  StyleSheet,
  ScrollView,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Med from "../../components/med";

export default function HomeScreen() {
  
  const colorScheme = useColorScheme(); // light or dark
  const isDark = colorScheme === "dark";

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

        {/* Med Component wrapped to scroll if overflowing */}
        <ThemedView style={styles.medContainer}>
          <Med />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
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
    backgroundColor: 'transparent',
  },
});
