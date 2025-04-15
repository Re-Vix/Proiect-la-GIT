import { View, Text, Alert, TouchableOpacity, Image } from 'react-native'
import { Avatars } from 'react-native-appwrite'
import { client } from '@/backend/appwrite'
import { useEffect, useState } from 'react'
import { Link } from 'expo-router'

const main = () => {

  const [avatarURI, setAvatarURI] = useState("")

useEffect(() => {
  const avatars = new Avatars(client);
  const result = avatars.getInitials();
  setAvatarURI(result.toString())
}, [])
 
  return (
    <View>
      <Text>main</Text>
  <Link href={'/user'}>
    <Image className='w-8 h-8 rounded-full' source={{ uri: avatarURI }} />
  </Link>
    </View>
  )
}

export default main