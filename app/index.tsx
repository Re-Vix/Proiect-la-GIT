import { Text, View, Button, Alert } from "react-native";
import { router } from "expo-router";
import { useAppwriteContext } from "@/backend/appwriteContextProvider";
import { login, account } from "@/backend/appwrite";


export default function Index() {
  account.deleteSession("current")
  const {loading, isLoggedIn} = useAppwriteContext();


  if(!loading && isLoggedIn) return router.replace('/(tabs)/main')

  const handleSignInGoogle = async () => {
    const result = await login()
    if(result) {
      router.push('/(tabs)/main')
    } else{
      Alert.alert("Error")
    }
  }

  return (
    <View>

      <Button title="Go to Home" onPress={() => router.push("/(tabs)/main")} />
      <Button title="Login" onPress={handleSignInGoogle} />

    </View>

  );
}
