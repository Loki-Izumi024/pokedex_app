import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "pokedex_team_v1";
export const TEAM_MAX = 6;

const TeamContext = createContext(null);

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setTeam(JSON.parse(raw));
      } catch (e) {
        console.warn("Could not load team", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEY, JSON.stringify(team)).catch((e) =>
      console.warn("Could not save team", e)
    );
  }, [team, loaded]);

  const isInTeam = useCallback((id) => team.some((p) => p.id === id), [team]);
  const isFull = team.length >= TEAM_MAX;

  const addToTeam = useCallback((p) => {
    setTeam((prev) =>
      prev.length >= TEAM_MAX || prev.some((x) => x.id === p.id)
        ? prev
        : [...prev, { id: p.id, name: p.name, types: p.types, stats: p.stats }]
    );
  }, []);

  const removeFromTeam = useCallback((id) => {
    setTeam((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <TeamContext.Provider value={{ team, loaded, isFull, isInTeam, addToTeam, removeFromTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => useContext(TeamContext);
