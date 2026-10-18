import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

import { TeamProvider, useTeam } from "./src/TeamContext";
import { STUDENT_NAME } from "./src/config";
import { colors } from "./src/theme";
import PokedexScreen from "./src/screens/PokedexScreen";
import DetailScreen from "./src/screens/DetailScreen";
import TeamScreen from "./src/screens/TeamScreen";
import GameScreen from "./src/screens/GameScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const headerStyle = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "800" },
};

const icon = (emoji) => ({ focused }) =>
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;

function Tabs() {
  const { team } = useTeam();
  return (
    <Tab.Navigator
      screenOptions={{
        ...headerStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarLabelStyle: { fontWeight: "700" },
      }}
    >
      <Tab.Screen
        name="Pokédex"
        component={PokedexScreen}
        options={{ title: `${STUDENT_NAME}’s Pokédex`, tabBarLabel: "Pokédex", tabBarIcon: icon("📖") }}
      />
      <Tab.Screen
        name="My Team"
        component={TeamScreen}
        options={{ tabBarIcon: icon("⭐"), tabBarBadge: team.length > 0 ? team.length : undefined }}
      />
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{ title: "Who’s That Pokémon?", tabBarLabel: "Game", tabBarIcon: icon("🎮") }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <TeamProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={headerStyle}>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "Details" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TeamProvider>
  );
}
