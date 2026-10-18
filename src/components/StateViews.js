import React from "react";
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { colors } from "../theme";

export function Loading({ text = "Loading…" }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.muted}>{text}</Text>
    </View>
  );
}

export function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.center}>
      <Text style={styles.emoji}>📡</Text>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.muted}>{message}</Text>
      <Pressable style={styles.btn} onPress={onRetry}>
        <Text style={styles.btnText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emoji: { fontSize: 44, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 4 },
  muted: { color: colors.muted, marginTop: 8, textAlign: "center" },
  btn: { marginTop: 16, backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
