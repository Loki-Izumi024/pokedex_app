const BASE = "https://pokeapi.co/api/v2";
export const MAX_POKEMON = 1025;

export const artworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const idFromUrl = (url) => parseInt(url.split("/").filter(Boolean).pop(), 10);

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export async function fetchPokemonPage(offset, limit = 20) {
  const data = await getJson(`${BASE}/pokemon?offset=${offset}&limit=${limit}`);
  return data.results
    .map((p) => ({ id: idFromUrl(p.url), name: p.name }))
    .filter((p) => p.id <= MAX_POKEMON);
}

let namesCache = null;
export async function fetchAllNames() {
  if (namesCache) return namesCache;
  const data = await getJson(`${BASE}/pokemon?limit=${MAX_POKEMON}`);
  namesCache = data.results.map((p) => ({ id: idFromUrl(p.url), name: p.name }));
  return namesCache;
}

const STAT_LABELS = {
  hp: "HP", attack: "Attack", defense: "Defense",
  "special-attack": "Sp. Atk", "special-defense": "Sp. Def", speed: "Speed",
};

const detailCache = {};
export async function fetchPokemonDetail(idOrName) {
  const key = String(idOrName).toLowerCase();
  if (detailCache[key]) return detailCache[key];
  const d = await getJson(`${BASE}/pokemon/${key}`);
  const detail = {
    id: d.id,
    name: d.name,
    types: d.types.map((t) => t.type.name),
    height: d.height / 10, 
    weight: d.weight / 10, 
    stats: d.stats.map((s) => ({
      key: s.stat.name,
      label: STAT_LABELS[s.stat.name] || s.stat.name,
      value: s.base_stat,
    })),
  };
  detailCache[key] = detail;
  return detail;
}
