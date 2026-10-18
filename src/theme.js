import { THEME_COLOR } from "./config";

export const colors = {
  primary: THEME_COLOR,
  bg: "#F5F3FA",
  card: "#FFFFFF",
  text: "#1E1B2E",
  muted: "#7A7690",
  green: "#2E9E5B",
  red: "#D64545",
  border: "#E4E0EF",
};

export const typeColors = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD",
};

export const cap = (s = "") =>
  s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export const pad = (n) => String(n).padStart(3, "0");
