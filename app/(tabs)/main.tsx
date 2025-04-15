import { View, Text, Alert, TouchableOpacity, Image, TextInput } from 'react-native'
import { Avatars } from 'react-native-appwrite'
import { client } from '@/backend/appwrite'
import { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { account } from '@/backend/appwrite'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const main = () => {

  const [avatarURI, setAvatarURI] = useState("")

useEffect(() => {
  const avatars = new Avatars(client);
  const result = avatars.getInitials();
  setAvatarURI(result.toString())
}, [])

  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
        const user = await account.get();
        setAccountName(user.name); 
    };

    fetchAccount();
  }, []);

  const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
      navigation.navigate('explore', { searchQuery });
    };
 
  return (
    <View>
      <View className='flex flex-row px-4 justify-between mt-6 items-center'>
        <View className='flex flex-row gap-3 items-center'>
          <Link href={'/user'}>
            <Image className='w-16 h-16 rounded-full' source={{ uri: avatarURI }} />
          </Link>
          <Text className='text-[20px]'>{accountName}</Text>
        </View>
        <Ionicons name='settings-outline' size={30}/>
      </View>
      <View className='flex-row items-center gap-2 border border-gray-300 rounded-lg px-4 py-3'>
          <Ionicons name='search-outline' size={24} color='black' />
          <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder='Search...' className='flex-1 ml-2 text-gray-700' />
          <TouchableOpacity onPress={handleSearch} className='bg-blue-500'>
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

export default main