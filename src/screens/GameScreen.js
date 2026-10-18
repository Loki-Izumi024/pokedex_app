import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAllNames, artworkUrl } from "../api";
import { colors, cap } from "../theme";
import { Loading, ErrorView } from "../components/StateViews";

const BEST_KEY = "pokedex_best_streak_v1";
const FIRST_GEN = 151;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function GameScreen() {
  const [names, setNames] = useState(null);
  const [error, setError] = useState(null);
  const [round, setRound] = useState(null); // { answer, options }
  const [picked, setPicked] = useState(null);
  const [hidden, setHidden] = useState([]); // options removed by hint
  const [hintUsed, setHintUsed] = useState(false);
  const [score, setScore] = useState(0);
  const [played, setPlayed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  const newRound = useCallback((all) => {
    const pool = all.filter((p) => p.id <= FIRST_GEN);
    const picks = shuffle(pool).slice(0, 4);
    const answer = picks[0];
    setRound({ answer, options: shuffle(picks) });
    setPicked(null);
    setHidden([]);
    setHintUsed(false);
  }, []);

  const init = useCallback(async () => {
    setError(null);
    try {
      const all = await fetchAllNames();
      setNames(all);
      newRound(all);
    } catch (e) {
      setError(e.message || "Network error");
    }
  }, [newRound]);

  useEffect(() => {
    init();
    AsyncStorage.getItem(BEST_KEY).then((v) => v && setBest(parseInt(v, 10) || 0)).catch(() => {});
  }, [init]);

  const answered = picked !== null;

  const choose = (opt) => {
    if (answered) return;
    setPicked(opt.id);
    setPlayed((n) => n + 1);
    if (opt.id === round.answer.id) {
      const s = streak + 1;
      setScore((n) => n + 1);
      setStreak(s);
      if (s > best) {
        setBest(s);
        AsyncStorage.setItem(BEST_KEY, String(s)).catch(() => {});
      }
    } else {
      setStreak(0);
    }
  };

  // Own feature: 50/50 hint – removes two wrong answers (once per round)
  const useHint = () => {
    if (answered || hintUsed) return;
    const wrong = round.options.filter((o) => o.id !== round.answer.id);
    setHidden(shuffle(wrong).slice(0, 2).map((o) => o.id));
    setHintUsed(true);
  };

  if (error) return <ErrorView message={error} onRetry={init} />;
  if (!round) return <Loading text="Getting ready…" />;

  const correct = answered && picked === round.answer.id;

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.container}>
      <View style={styles.scoreRow}>
        <Stat label="Score" value={`${score}/${played}`} />
        <Stat label="Streak" value={streak} />
        <Stat label="Best" value={best} />
      </View>

      <Text style={styles.title}>Who’s that Pokémon?</Text>

      <View style={styles.stage}>
        <Image
          key={round.answer.id + (answered ? "r" : "s")}
          source={{ uri: artworkUrl(round.answer.id) }}
          style={[styles.img, !answered && { tintColor: "#000" }]}
          resizeMode="contain"
        />
      </View>

      {answered && (
        <Text style={[styles.result, { color: correct ? colors.green : colors.red }]}>
          {correct ? "Correct! 🎉" : `It’s ${cap(round.answer.name)}!`}
        </Text>
      )}

      {round.options.map((opt) => {
        if (hidden.includes(opt.id)) return <View key={opt.id} style={styles.optGone} />;
        let bg = colors.card, border = colors.border, txt = colors.text;
        if (answered) {
          if (opt.id === round.answer.id) { bg = colors.green; border = colors.green; txt = "#fff"; }
          else if (opt.id === picked) { bg = colors.red; border = colors.red; txt = "#fff"; }
        }
        return (
          <Pressable
            key={opt.id}
            onPress={() => choose(opt)}
            style={[styles.opt, { backgroundColor: bg, borderColor: border }]}
          >
            <Text style={[styles.optText, { color: txt }]}>{cap(opt.name)}</Text>
          </Pressable>
        );
      })}

      {!answered && (
        <Pressable onPress={useHint} disabled={hintUsed} style={[styles.hint, hintUsed && { opacity: 0.4 }]}>
          <Text style={styles.hintText}>💡 Hint (remove 2 wrong answers)</Text>
        </Pressable>
      )}

      {answered && (
        <Pressable onPress={() => newRound(names)} style={styles.next}>
          <Text style={styles.nextText}>Next ▶</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const Stat = ({ label, value }) => (
  <View style={styles.stat}>
    <Text style={styles.statVal}>{value}</Text>
    <Text style={styles.statLab}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  scoreRow: { flexDirection: "row", marginBottom: 12 },
  stat: {
    flex: 1, alignItems: "center", backgroundColor: colors.card, borderRadius: 14,
    paddingVertical: 10, marginHorizontal: 4, borderWidth: 1, borderColor: colors.border,
  },
  statVal: { fontSize: 22, fontWeight: "900", color: colors.primary },
  statLab: { fontSize: 12, color: colors.muted },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center", color: colors.text, marginVertical: 6 },
  stage: {
    alignSelf: "center", width: 250, height: 250, borderRadius: 125, backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: colors.primary, marginVertical: 10,
  },
  img: { width: 210, height: 210 },
  result: { textAlign: "center", fontSize: 20, fontWeight: "800", marginBottom: 8 },
  opt: { borderWidth: 2, borderRadius: 16, paddingVertical: 14, marginVertical: 5, alignItems: "center" },
  optGone: { height: 54, marginVertical: 5 },
  optText: { fontSize: 17, fontWeight: "700" },
  hint: { alignSelf: "center", marginTop: 12, padding: 10 },
  hintText: { color: colors.primary, fontWeight: "700" },
  next: { marginTop: 16, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 26, alignItems: "center" },
  nextText: { color: "#fff", fontSize: 17, fontWeight: "800" },
});
