import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Text } from "react-native"


export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: "#EF5A5A",
                    padding: 4,
                    height: 65
                }
            }}>
            <Tabs.Screen
                name="main"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name="home"
                            size={24}
                            color={focused ? "#EF5A5A" : "#cecece"}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text className={`text-sm text-${focused ? "black" : "gray-400"}`}>
                            Home
                        </Text>
                    )
                }} />

            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name="earth"
                            size={24}
                            color={focused ? "#EF5A5A" : "#cecece"}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text className={`text-sm text-${focused ? "black" : "gray-400"}`}>
                            Favorites
                        </Text>
                    )
                }} />

            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name="time-outline"
                            size={24}
                            color={focused ? "#EF5A5A" : "#cecece"}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text className={`text-sm text-${focused ? "black" : "gray-400"}`}>
                            Favorites
                        </Text>
                    )
                }} />

            <Tabs.Screen
                name="favorites"
                options={{
                    title: "Favorites",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "heart" : "heart-outline"}
                            size={24}
                            color={focused ? "#EF5A5A" : "#cecece"}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text className={`text-sm text-${focused ? "black" : "gray-400"}`}>
                            Favorites
                        </Text>
                    )
                }} />

        </Tabs>
    );
}