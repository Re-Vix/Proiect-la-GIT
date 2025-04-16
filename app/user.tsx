import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import { account } from '@/backend/appwrite'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { Avatars } from 'react-native-appwrite'
import { client } from '@/backend/appwrite'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'

const user = () => {

  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
        const user = await account.get();
        setAccountName(user.name); 
        setAccountEmail(user.email); 
    };

    fetchAccount();
  }, []);

    const [avatarURI, setAvatarURI] = useState("")
  
  useEffect(() => {
    const avatars = new Avatars(client);
    const result = avatars.getInitials();
    setAvatarURI(result.toString())
  }, [])

  const handleLogout = async () => {
      try {
        const response = await account.deleteSession('current')
        console.log(response);
        Alert.alert("Success", "You have logged out!");
        if(response) {
          router.replace('/')
        }
      } catch (error: any) {
        console.error(error);
        Alert.alert("Error", error.message);
      }
    }

  return (
    <View>
      <View className='flex flex-row items-center justify-between px-2 py-3'>
        <Link href={'/main'}><Ionicons name="arrow-back-outline" size={32}/></Link>
        <Text className='text-[24px] mr-4'>Profile</Text>
        <Text></Text>
      </View>
      <View className='flex flex-row gap-8 items-center px-2'>
        <Image className='w-24 h-24 rounded-full' source={{ uri: avatarURI }} />
        <View className='flex flex-col'>
            <Text className='font-semibold text-[24px]'>{accountName}</Text>
            <Text className='text-gray-500'>{accountEmail}</Text>
        </View>
      </View>
      <TouchableOpacity className='bg-blue-500 rounded-full py-3 px-6 w-[80%] mx-auto mt-8' onPress={handleLogout}>
        <Text className='text-white text-center'>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default user