import { Text, View, Button, Alert, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { useAppwriteContext } from "@/backend/appwriteContextProvider";
import { login, account } from "@/backend/appwrite";
import { Link } from "expo-router";
import { handleSignInGoogle } from "@/backend/appwrite";
import { useEffect } from "react";


export default function Index() {
  const {loading, isLoggedIn} = useAppwriteContext();
  if(!loading && isLoggedIn) return router.replace('/(tabs)/main')

    useEffect(() => {
      const checkSession = async () => {
        try {
          const activeSession = await account.getSession('current');
          console.log(activeSession)
          if(activeSession)
          {
            router.replace('/(tabs)/main')
          } 
        } catch (error) {
          console.error("Error fetching session:", error);
        }
      };
    
      checkSession();
    }, []);

  return (
    <View className="flex-1 items-center">
      <Image resizeMode="cover" className="w-full h-[105%] absolute" source={{uri:'https://i.pinimg.com/736x/fa/05/50/fa05508f96befb2ecd988da85b8b9a87.jpg'}}/>
        <View className="flex flex-col gap-4 items-center absolute bottom-10">
      <TouchableOpacity onPress={handleSignInGoogle} className='rounded-2xl w-[340px] border-gray-200 bg-white border flex flex-row gap-4 items-center justify-center px-6 py-5'>
                <Image source={{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png'}} className='w-[24px] h-[24px]'/>
                <Text className='font-semibold text-[20px]'>Continue with Google</Text>
            </TouchableOpacity>
      <TouchableOpacity className='w-[340px] bg-[#A2B2FC] rounded-2xl'>
          <Link href={'/sign-up'} className='text-white font-semibold text-center py-5 text-[20px]'>Create Account</Link>
      </TouchableOpacity>
      <TouchableOpacity className='w-[340px] bg-[#A2B2FC] rounded-2xl'>
          <Link href={'/login'} className='text-white font-semibold text-center py-5 text-[20px]'>Login</Link>
      </TouchableOpacity>
        </View>
      
        
    </View>

  );
}
