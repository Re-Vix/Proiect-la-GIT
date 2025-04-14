import { Text, View, Button, Alert, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useAppwriteContext } from "@/backend/appwriteContextProvider";
import { login, account } from "@/backend/appwrite";
import { Link } from "expo-router";
import { handleSignInGoogle } from "@/backend/appwrite";


export default function Index() {
  account.deleteSession("current")
  const {loading, isLoggedIn} = useAppwriteContext();


  if(!loading && isLoggedIn) return router.replace('/(tabs)/main')

  return (
    <View className="flex flex-col gap-4">

      <Button title="Go to Home" onPress={() => router.push("/(tabs)/main")} />
      <Button title="Login with Google" onPress={handleSignInGoogle} />
      <TouchableOpacity className='bg-blue-500 px-7 py-4 w-full'>
        <Link href={'/sign-up'}><Text className='text-white text-xl text-center'>Create Account</Text></Link>
      </TouchableOpacity>
      <TouchableOpacity className='bg-blue-500 px-7 py-4 w-full'>
        <Link href={'/login'}><Text className='text-white text-xl text-center'>Login</Text></Link>
      </TouchableOpacity>

    </View>

  );
}
