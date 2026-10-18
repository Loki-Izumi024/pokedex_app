import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View, Text, FlatList, TextInput, ActivityIndicator, Pressable, StyleSheet,
} from "react-native";
import { fetchPokemonPage, fetchAllNames, MAX_POKEMON } from "../api";
import { START_OFFSET } from "../config";
import { colors } from "../theme";
import PokemonCard from "../components/PokemonCard";
import { Loading, ErrorView } from "../components/StateViews";

const PAGE = 20;

export default function PokedexScreen({ navigation }) {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const offsetRef = useRef(START_OFFSET);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const seenRef = useRef(new Set()); 

  const loadPage = useCallback(async (reset = false) => {
    if (loadingRef.current) return;
    if (reset) {
      offsetRef.current = START_OFFSET;
      seenRef.current = new Set();
      hasMoreRef.current = true;
    }
    if (!hasMoreRef.current) return;
    const limit = Math.min(PAGE, MAX_POKEMON - offsetRef.current);
    if (limit <= 0) { hasMoreRef.current = false; return; }

    loadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonPage(offsetRef.current, limit);
      const fresh = data.filter((p) => !seenRef.current.has(p.id));
      fresh.forEach((p) => seenRef.current.add(p.id));
      offsetRef.current += limit;
      if (data.length < limit || offsetRef.current >= MAX_POKEMON) hasMoreRef.current = false;
      setItems((prev) => (reset ? fresh : [...prev, ...fresh]));
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadPage(true); }, [loadPage]);

  const onRefresh = () => { setRefreshing(true); loadPage(true); };

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchTick, setSearchTick] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!debounced) { setResults([]); setSearchError(null); return; }
    let cancelled = false;
    setSearching(true);
    setSearchError(null);
    fetchAllNames()
      .then((all) => {
        if (cancelled) return;
        setResults(all.filter((p) => p.name.includes(debounced) || String(p.id) === debounced));
      })
      .catch((e) => !cancelled && setSearchError(e.message || "Network error"))
      .finally(() => !cancelled && setSearching(false));
    return () => { cancelled = true; };
  }, [debounced, searchTick]);

  const isSearching = query.trim().length > 0;
  const open = (id) => navigation.navigate("Detail", { id });

  const renderItem = ({ item }) => (
    <PokemonCard id={item.id} name={item.name} onPress={() => open(item.id)} />
  );

  let body;
  if (isSearching) {
    if (searchError) body = <ErrorView message={searchError} onRetry={() => setSearchTick((n) => n + 1)} />;
    else if (searching || query.trim().toLowerCase() !== debounced) body = <Loading text="Searching…" />;
    else if (results.length === 0)
      body = (
        <View style={styles.empty}>
          <Text style={{ fontSize: 40 }}>🔍</Text>
          <Text style={styles.emptyText}>No Pokémon found for “{query.trim()}”</Text>
        </View>
      );
    else
      body = (
        <FlatList
          data={results}
          keyExtractor={(p) => String(p.id)}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      );
  } else if (items.length === 0 && loading) {
    body = <Loading text="Loading Pokémon…" />;
  } else if (items.length === 0 && error) {
    body = <ErrorView message={error} onRetry={() => loadPage(true)} />;
  } else {
    body = (
      <FlatList
        data={items}
        keyExtractor={(p) => String(p.id)}
        renderItem={renderItem}
        onEndReached={() => loadPage(false)}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator style={{ margin: 16 }} color={colors.primary} />
          ) : error ? (
            <View style={styles.footerErr}>
              <Text style={{ color: colors.red }}>Couldn’t load more: {error}</Text>
              <Pressable onPress={() => loadPage(false)} style={styles.retrySm}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Retry</Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Search all Pokémon by name…"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchWrap: { padding: 12, paddingBottom: 6 },
  search: {
    backgroundColor: colors.card, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 10,
    fontSize: 16, borderWidth: 1, borderColor: colors.border, color: colors.text,
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyText: { marginTop: 8, color: colors.muted, fontSize: 16, textAlign: "center" },
  footerErr: { alignItems: "center", padding: 16 },
  retrySm: { marginTop: 8, backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
});
