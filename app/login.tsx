import { View, Text, Alert, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, Button } from 'react-native'
import React from 'react'
import { account } from "@/backend/appwrite";
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { handleSignInGoogle } from '@/backend/appwrite';
import { useAppwriteContext } from '@/backend/appwriteContextProvider';
import { Link } from 'expo-router';


const login = () => {

    const {loading, isLoggedIn} = useAppwriteContext();
    if(!loading && isLoggedIn) return router.replace('/(tabs)/main')

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async () => {
          try {
            const response = await account.createEmailPasswordSession(email, password)
            console.log(response);
            Alert.alert("Success", "Your have succesfully logged in!");
            if(response) {
              router.push('/main')
            }
          } catch (error: any) {
            console.error(error);
            Alert.alert("Error", error.message);
          }
    }
        

  return (
    <KeyboardAvoidingView className="flex-1 items-center gap-8">
        <View className='flex flex-col gap-2 top-20'>
            <Text className='text-[#424242] text-[40px] text-center'>Welcome</Text>
            <Text className='text-[#9D9D9D] text-[18px] text-center'>Sign in to start</Text>
        </View>
        <View className='mt-24 flex items-center justify-center'>
            <TouchableOpacity className='rounded-full border-gray-200 border flex flex-row gap-4 items-center justify-center px-6 py-3'>
                <Image source={{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png'}} className='w-[24px] h-[24px]'/>
                <Text className='text-[18px]'>Continue with Google</Text>
            </TouchableOpacity>
            <Text className='mt-8 text-[18px]'>Don't have an account?<Link className='text-blue-500 text-[18px]' href={'/sign-up'}> Sign up!</Link></Text>
        </View>
       
        <View className='bg-[#A2B2FC] w-full h-[50vh] rounded-t-[24px] absolute bottom-0 flex items-center gap-6'>
        <View className="w-[90%] mt-24">
        <TextInput 
            className="border-b-2 border-white rounded-md px-4 py-5 w-full text-white placeholder:text-white text-[18px]" 
            placeholder="Email..." 
            value={email} 
            onChangeText={setEmail}
          />
        </View>
          
        <View className="w-[90%]">
        <TextInput 
            className="border-b-2 border-white rounded-md px-4 py-5 w-full text-white placeholder:text-white text-[18px]" 
            placeholder="Password..." 
            secureTextEntry={!showPassword}
            value={password} 
            onChangeText={setPassword}
          />
          <TouchableOpacity className="absolute top-5 right-5" onPress={() => setShowPassword(!showPassword)}>
        {
            showPassword ? 
            <Ionicons color='white' name="eye-outline" size={24} />:
            <Ionicons color='white' name="eye-off-outline" size={24} />
        }
      </TouchableOpacity>
        </View>
          
          <TouchableOpacity 
            className={`bg-[#424242] px-7 rounded-full py-4 w-[90%] mt-10`}
            onPress={handleLogin}
          >
            <Text className="text-white text-xl text-center">Continue</Text>
          </TouchableOpacity>
        </View>
        
    </KeyboardAvoidingView>
  )

};

export default login