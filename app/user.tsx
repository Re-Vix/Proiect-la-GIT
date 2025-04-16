import { View, Text, TouchableOpacity, Alert, Image, TextInput } from 'react-native'
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

    const [avatarURI, setAvatarURI] = useState<any>()
  
  useEffect(() => {
    const avatars = new Avatars(client);
    const result = avatars.getInitials(accountName);
    setAvatarURI(result.toString())
  }, [accountName])

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
    
    const [isEditing, setIsEditing] = useState(false)
    const [newName, setNewName] = useState("")

  const handleUpdateName = async () => {
    try {
      const response = await account.updateName(newName)
      Alert.alert("Success", "You have successfully updated your name!");
      if(response) {
        router.replace('/user')
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
        <Image className='w-24 h-24 rounded-full' source={{uri: avatarURI}} />
        <View className='flex flex-col'>
          <View>
          {isEditing ? (
        <View className="flex-row items-center gap-2">
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Enter name..."
            className="w-[140px] border px-3 py-2 rounded flex-1"
          />
          <TouchableOpacity onPress={handleUpdateName}>
            <Ionicons name="checkmark-outline" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setNewName(accountName); setIsEditing(false); }}>
            <Ionicons name="close-outline" size={24} />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row items-center gap-2">
          <Text className="font-semibold text-[24px]">{accountName}</Text>
          <TouchableOpacity onPress={() => {setNewName(accountName); setIsEditing(true);}}>
            <Ionicons name="create-outline" size={24} />
          </TouchableOpacity>
        </View>
      )}
          </View>
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