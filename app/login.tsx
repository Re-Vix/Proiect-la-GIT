import { View, Text, Alert, TextInput, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { account } from "@/backend/appwrite";
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';


const login = () => {

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
    <KeyboardAvoidingView className="flex-1 justify-center items-center gap-8">
             
        <View className="relative w-[90%]">
        <TextInput 
            className="border border-gray-400 rounded-md px-8 py-5 w-full" 
            placeholder="Email..." 
            value={email} 
            onChangeText={setEmail}
          />
        </View>
          
        <View className="relative w-[90%]">
        <TextInput 
            className="border border-gray-400 rounded-md px-8 py-5 w-full" 
            placeholder="Password..." 
            secureTextEntry={!showPassword}
            value={password} 
            onChangeText={setPassword}
          />
          <TouchableOpacity className="absolute top-5 right-5" onPress={() => setShowPassword(!showPassword)}>
        {
            showPassword ? 
            <Ionicons name="eye-outline" size={24} />:
            <Ionicons  name="eye-off-outline" size={24} />
        }
      </TouchableOpacity>
        </View>
          
          <TouchableOpacity 
            className={`bg-blue-500 px-7 rounded-lg py-4 w-[90%]`}
            onPress={handleLogin}
          >
            <Text className="text-white text-xl text-center">Login</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
  )

};

export default login