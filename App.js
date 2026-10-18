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
  headerStyle: {
    backgroundColor: colors.primary,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "800", fontSize: 20 },
  headerTitleAlign: "center",
};

const tabBarStyle = {
  backgroundColor: "#fff",
  borderTopWidth: 0,
  borderRadius: 20,
  marginHorizontal: 12,
  marginBottom: 10,
  height: 72,
  paddingTop: 8,
  paddingBottom: 8,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: -4 },
  elevation: 8,
};

const icon = (emoji) => ({ focused }) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.6 }}>{emoji}</Text>
);

function Tabs() {
  const teamContext = useTeam() || {};
  const team = Array.isArray(teamContext.team) ? teamContext.team : [];
  const badgeCount = team.length > 0 ? team.length : undefined;

  return (
    <Tab.Navigator
      initialRouteName="Pokedex"
      screenOptions={{
        ...headerStyle,
        tabBarStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarActiveBackgroundColor: colors.surface,
        tabBarItemStyle: { borderRadius: 14, marginHorizontal: 4 },
        tabBarLabelStyle: { fontWeight: "700", fontSize: 12 },
        tabBarIconStyle: { marginBottom: 2 },
      }}
    >
      <Tab.Screen
        name="Pokedex"
        component={PokedexScreen}
        options={{
          title: `${STUDENT_NAME}’s Pokédex`,
          tabBarLabel: "Pokédex",
          tabBarIcon: icon("📖"),
        }}
      />
      <Tab.Screen
        name="Team"
        component={TeamScreen}
        options={{
          title: "My Team",
          tabBarIcon: icon("⭐"),
          tabBarBadge: badgeCount,
        }}
      />
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{
          title: "Who’s That Pokémon?",
          tabBarLabel: "Game",
          tabBarIcon: icon("🎮"),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <TeamProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="PokedexTabs"
          screenOptions={{
            ...headerStyle,
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="PokedexTabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "Details" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TeamProvider>
  );
}
