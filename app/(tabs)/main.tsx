import { View, Text, Alert, TouchableOpacity } from 'react-native'
import { account } from '@/backend/appwrite'
import { router } from 'expo-router'


const main = () => {

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
      <Text>main</Text>
      <TouchableOpacity className='bg-blue-500 rounded-full py-3 px-6 ' onPress={handleLogout}>
        <Text className='text-white'>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default main