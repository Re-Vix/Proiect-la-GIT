import { View, Text, TouchableOpacity, Alert, Image, TextInput } from 'react-native'
import { account } from '@/backend/appwrite'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { Avatars } from 'react-native-appwrite'
import { client } from '@/backend/appwrite'
import { Ionicons } from '@expo/vector-icons'
import { database, databaseId, userDataCollection } from '@/backend/appwrite'
import { ID } from 'react-native-appwrite'
import { Dropdown } from 'react-native-element-dropdown'

const user = () => {

  const languageOptions = [
    { label: 'English', value: 'English' },
    { label: 'Romanji', value: 'Romanji' }
  ];

  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountId, setAccountId] = useState("");
  const [userDatas, setUserDatas] = useState([])
  const [language, setLanguage] = useState("English")

  useEffect(() => {
    const fetchAccount = async () => {
        const user = await account.get();
        setAccountName(user.name); 
        setAccountEmail(user.email); 
        setAccountId(user.$id);
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


  useEffect(() => {

    const fetchUserData = async () => {
      try{
        const response = await database.listDocuments(databaseId, userDataCollection)
        if (response) {
          setUserDatas(response.documents)
        }
      } catch(e:any) {
        console.error(e)
        Alert.alert("Error", e.message);
      }
    } 

    fetchUserData();
  }, [])

  useEffect(() => {
    if (userDatas && userDatas.length > 0) {
      const getCurrentUserLanguagePreference = () => {
        const currentUserData = userDatas.find(user => user.UserID === accountId);
        setLanguage(currentUserData?.LanguagePreference || null);
      };
  
      getCurrentUserLanguagePreference();
    }
  }, [userDatas]);

  const checkExistsUserData = async () => {
    if (userDatas && userDatas.length > 0) {
      const existing = userDatas.find(userData => userData.UserID?.toString().trim() === accountId?.toString().trim());
      return existing || null;
    }
    return null;
  };

  const createOrUpdateUserData = async () => {
    try {
      const existingUserData = await checkExistsUserData();
  
      if (existingUserData) {
        const response = await database.updateDocument(
          databaseId,
          userDataCollection,
          existingUserData.$id,
          {
            LanguagePreference: language,
          }
        );
        Alert.alert("Info", "Preferred language updated!");
        router.replace('/main')
      } else {
        const response = await database.createDocument(
          databaseId,
          userDataCollection,
          ID.unique(),
          {
            LastViewedID: '',
            LanguagePreference: language,
            UserID: accountId
          }
        );
        Alert.alert("Info", "Preferred language updated!");
        router.replace('/main')
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", e.message);
    }
  };
  

  return (
    <View>
      <View className='flex flex-row items-center justify-between px-2 py-3'>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={32}/></TouchableOpacity>
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
      <Text className='mt-6'>Select Language:</Text>
      <Dropdown
        data={languageOptions}
        labelField="label"
        valueField="value"
        value={language}
        onChange={item => setLanguage(item.value)}
      />
      <Text>Selected: {language}</Text>
      <TouchableOpacity className='bg-blue-500 rounded-full py-3 px-6 w-[80%] mx-auto mt-8' onPress={createOrUpdateUserData}>
        <Text className='text-white text-center'>Save Language Preference</Text>
      </TouchableOpacity>
    </View>
  )
}

export default user