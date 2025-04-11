import { Text, View, Button } from "react-native";
import { router } from "expo-router";


export default function Index() {
  return (
    <View>

      <Button title="Go to Home" onPress={() => router.push("/(tabs)/main")} />

    </View>

  );
}
