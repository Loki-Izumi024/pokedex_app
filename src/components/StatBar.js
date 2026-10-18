import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

export default function StatBar({ label, value, max = 255 }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = value >= 100 ? colors.green : value >= 60 ? colors.primary : colors.red;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  label: { width: 66, color: colors.muted, fontWeight: "600", fontSize: 13 },
  value: { width: 36, color: colors.text, fontWeight: "700", textAlign: "right", marginRight: 10 },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.border, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 5 },
});
