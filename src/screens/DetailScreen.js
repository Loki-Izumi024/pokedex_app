import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, View, Text, Image, Pressable, StyleSheet } from "react-native";
import { fetchPokemonDetail, artworkUrl } from "../api";
import { useTeam, TEAM_MAX } from "../TeamContext";
import { colors, typeColors, cap, pad } from "../theme";
import StatBar from "../components/StatBar";
import { Loading, ErrorView } from "../components/StateViews";

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { team, isInTeam, isFull, addToTeam, removeFromTeam } = useTeam();
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    setPokemon(null);
    try {
      setPokemon(await fetchPokemonDetail(id));
    } catch (e) {
      setError(e.message || "Network error");
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  useLayoutEffect(() => {
    if (pokemon) navigation.setOptions({ title: cap(pokemon.name) });
  }, [pokemon, navigation]);

  if (error) return <ErrorView message={error} onRetry={load} />;
  if (!pokemon) return <Loading text="Loading details…" />;

  const inTeam = isInTeam(pokemon.id);
  const disabled = !inTeam && isFull;
  const mainColor = typeColors[pokemon.types[0]] || colors.primary;

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={[styles.hero, { backgroundColor: mainColor + "55" }]}>
        <Image source={{ uri: artworkUrl(pokemon.id) }} style={styles.art} resizeMode="contain" />
      </View>

      <View style={styles.body}>
        <Text style={styles.num}>No. {pad(pokemon.id)}</Text>
        <Text style={styles.name}>{cap(pokemon.name)}</Text>

        <View style={styles.typeRow}>
          {pokemon.types.map((t) => (
            <View key={t} style={[styles.type, { backgroundColor: typeColors[t] || colors.muted }]}>
              <Text style={styles.typeText}>{cap(t)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.measures}>
          <View style={styles.measure}>
            <Text style={styles.mVal}>{pokemon.height.toFixed(1)} m</Text>
            <Text style={styles.mLab}>Height</Text>
          </View>
          <View style={styles.measure}>
            <Text style={styles.mVal}>{pokemon.weight.toFixed(1)} kg</Text>
            <Text style={styles.mLab}>Weight</Text>
          </View>
        </View>

        <Text style={styles.section}>Base stats</Text>
        {pokemon.stats.map((s) => (
          <StatBar key={s.key} label={s.label} value={s.value} />
        ))}

        <Pressable
          disabled={disabled}
          onPress={() => (inTeam ? removeFromTeam(pokemon.id) : addToTeam(pokemon))}
          style={[
            styles.btn,
            inTeam && { backgroundColor: colors.red },
            disabled && { backgroundColor: colors.muted, opacity: 0.6 },
          ]}
        >
          <Text style={styles.btnText}>
            {inTeam ? "Remove from team" : disabled ? `Team is full (${TEAM_MAX}/${TEAM_MAX})` : "Add to team"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", paddingVertical: 20 },
  art: { width: 240, height: 240 },
  body: { padding: 20 },
  num: { color: colors.muted, fontWeight: "600" },
  name: { fontSize: 30, fontWeight: "800", color: colors.text },
  typeRow: { flexDirection: "row", marginTop: 8 },
  type: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 14, marginRight: 8 },
  typeText: { color: "#fff", fontWeight: "700" },
  measures: { flexDirection: "row", marginVertical: 18 },
  measure: {
    flex: 1, alignItems: "center", backgroundColor: colors.card, paddingVertical: 12,
    borderRadius: 14, marginRight: 10, borderWidth: 1, borderColor: colors.border,
  },
  mVal: { fontSize: 18, fontWeight: "800", color: colors.text },
  mLab: { color: colors.muted, fontSize: 12 },
  section: { fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: 6 },
  btn: { marginTop: 24, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 26, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
