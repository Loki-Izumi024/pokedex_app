# Pokédex (Expo / React Native)

## Setup
```bash
npx create-expo-app@latest pokedex-<your-student-no> --template blank
cd pokedex-<your-student-no>
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage
```
Copy `App.js` and the `src/` folder from this project over the new project, then:
```bash
npx expo start
```
Scan the QR code with Expo Go.

## Personalise
Edit `src/config.js`: `STUDENT_NAME`, `STUDENT_NUMBER` (last 3 digits = start offset), `THEME_COLOR`.

## Structure
- `src/api.js` – all PokeAPI calls (+ caching)
- `src/TeamContext.js` – shared team + AsyncStorage persistence
- `src/screens/` – Pokédex, Detail, My Team, Game
- `src/components/` – PokemonCard, StatBar, Loading/Error views

## Own feature
50/50 hint button in the game, plus pull-to-refresh on the Pokédex list.
