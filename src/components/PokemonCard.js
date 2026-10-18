import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { artworkUrl } from "../api";
import { colors, cap, pad } from "../theme";

export default function PokemonCard({ id, name, onPress, right }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.imgWrap}>
        <Image source={{ uri: artworkUrl(id) }} style={styles.img} resizeMode="contain" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.num}>No. {pad(id)}</Text>
        <Text style={styles.name}>{cap(name)}</Text>
      </View>
      {right}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.card,
    borderRadius: 16, padding: 10, marginHorizontal: 14, marginVertical: 5,
    borderWidth: 1, borderColor: colors.border,
  },
  imgWrap: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.bg,
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  img: { width: 64, height: 64 },
  num: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  name: { color: colors.text, fontSize: 18, fontWeight: "700" },
});
