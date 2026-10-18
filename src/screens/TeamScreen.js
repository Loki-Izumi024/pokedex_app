import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useTeam, TEAM_MAX } from "../TeamContext";
import { colors } from "../theme";
import PokemonCard from "../components/PokemonCard";
import StatBar from "../components/StatBar";
import { Loading } from "../components/StateViews";

const ORDER = [
  ["hp", "HP"], ["attack", "Attack"], ["defense", "Defense"],
  ["special-attack", "Sp. Atk"], ["special-defense", "Sp. Def"], ["speed", "Speed"],
];

export default function TeamScreen({ navigation }) {
  const { team, loaded, removeFromTeam } = useTeam();
  if (!loaded) return <Loading text="Loading your team…" />;

  const totals = ORDER.map(([key, label]) => ({
    key, label,
    value: team.reduce((sum, p) => sum + (p.stats.find((s) => s.key === key)?.value || 0), 0),
  }));
  const grand = totals.reduce((a, s) => a + s.value, 0);

  const header = (
    <View style={styles.summary}>
      <View style={styles.countRow}>
        <Text style={styles.count}>{team.length}/{TEAM_MAX}</Text>
        <Text style={styles.countLab}>team members</Text>
      </View>
      {team.length > 0 && (
        <>
          <Text style={styles.section}>Combined base stats · Total {grand}</Text>
          {totals.map((s) => (
            <StatBar key={s.key} label={s.label} value={s.value} max={TEAM_MAX * 200} />
          ))}
        </>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={team}
        keyExtractor={(p) => String(p.id)}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 44 }}>🎒</Text>
            <Text style={styles.emptyText}>Your team is empty.{"\n"}Open a Pokémon and tap “Add to team”.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PokemonCard
            id={item.id}
            name={item.name}
            onPress={() => navigation.navigate("Detail", { id: item.id })}
            right={
              <Pressable onPress={() => removeFromTeam(item.id)} style={styles.remove} hitSlop={8}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    margin: 14, padding: 16, backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  countRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 6 },
  count: { fontSize: 34, fontWeight: "900", color: colors.primary, marginRight: 8 },
  countLab: { color: colors.muted, fontSize: 15 },
  section: { fontWeight: "800", color: colors.text, marginVertical: 8 },
  empty: { alignItems: "center", padding: 30 },
  emptyText: { textAlign: "center", color: colors.muted, marginTop: 8, lineHeight: 22 },
  remove: { backgroundColor: colors.red, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14 },
  removeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
});
