import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === "web" ? 65 : 60,
          paddingBottom: Platform.OS === "web" ? 10 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: Platform.OS === "web" ? 13 : 12,
          fontWeight: "600",
          marginBottom: Platform.OS === "web" ? 2 : 0,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === "web" ? 4 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={Platform.OS === "web" ? 24 : size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="classrooms"
        options={{
          title: "Classes",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={Platform.OS === "web" ? 24 : size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="assignments"
        options={{
          title: "Assignments",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={Platform.OS === "web" ? 24 : size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={Platform.OS === "web" ? 24 : size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
