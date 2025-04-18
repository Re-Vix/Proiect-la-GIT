import { View, Text, Alert, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { getMangaByIdQueryAndVariables } from "@/backend/useAnilistAPI"
import { useState, useEffect } from 'react'
import { database, databaseId, userDataCollection, account } from '@/backend/appwrite'
import { ID } from 'react-native-appwrite'
import { router } from 'expo-router'
import { Dropdown } from 'react-native-element-dropdown'
import { Ionicons } from '@expo/vector-icons'


const status = [
  { label: '- Manga Status -', value: '' },
  { label: 'Reading', value: 'Reading' },
  { label: 'Finished', value: 'Finished' },
  { label: 'On Hold', value: 'On-hold' },
  { label: 'Plan to Read', value: 'Plan-to-read' },
  { label: 'Dropped', value: 'Dropped' }
]







const Manga = () => {
  const { id } = useLocalSearchParams()

  const [language, setLanguage] = useState("English")
  const [manga, setManga] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [accountId, setAccountId] = useState("");
  const [userDatas, setUserDatas] = useState<any>([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await database.listDocuments(databaseId, userDataCollection)
        if (response) {
          setUserDatas(response.documents)
          // console.log(response.documents);
        }
      } catch (e: any) {
        console.error(e)
        Alert.alert("Error", e.message);
      }
    }

    fetchUserData();
  }, [])

  useEffect(() => {
    const fetchAccount = async () => {
      const user = await account.get();
      setAccountId(user.$id);
    };

    fetchAccount();
  }, []);

  const getMangaFromAPI = async (search: string = "", genre: string = "") => {
    const { query, variables } = await getMangaByIdQueryAndVariables(Number(id));
    const fetchData = async () => {
      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            variables: variables
          })
        }).then(response => response.json());
        if (response.data) {
          setManga(response.data.Media);
          setError(null)
        }
        else {
          setError("Error: Manga not found")
          setManga(null)
        }
      } catch (error) {
        console.log(error);
        setManga(null)
        setError(error)
      }
    }
    fetchData();
  }

  useEffect(() => {
    getMangaFromAPI()
  }, [])

  const checkExistsUserData = async () => {
    if (userDatas && userDatas.length > 0) {
      // console.log(accountId);
      const existing = userDatas.find(userData => userData.UserID?.toString().trim() === accountId?.toString().trim());
      if (existing) {
        return existing;
      } else return null;
    }
    return null;
  };


  useEffect(() => {

    const createOrUpdateUserData = async () => {
      try {
        const existingUserData = await checkExistsUserData();
        // console.log(existingUserData);
        if (existingUserData) {
          const response = await database.updateDocument(
            databaseId,
            userDataCollection,
            existingUserData.$id,
            {
              LastViewedID: id,
            }
          );
        } else {
          const response = await database.createDocument(
            databaseId,
            userDataCollection,
            ID.unique(),
            {
              LastViewedID: id,
              LanguagePreference: language,
              UserID: accountId
            }
          );
        }
      } catch (e: any) {
        console.error(e);
        Alert.alert("Error", e.message);
      }
    };

    if (userDatas !== null && accountId && accountId.trim() !== "") {
      createOrUpdateUserData();
    }
  }, [userDatas])


  useEffect(() => {
    if (userDatas && userDatas.length > 0) {
      const getCurrentUserLanguagePreference = () => {
        const currentUserData = userDatas.find((user: any) => user.UserID === accountId);
        setLanguage(currentUserData?.LanguagePreference || null);
      };

      getCurrentUserLanguagePreference();
    }
  }, [userDatas]);




  return (
    <View className='p-4 flex-1'>
      {/* <Text>{Number(id)}</Text> */}

      {error ? (<Text>{error}</Text>) : manga ?
        (
          <View className='mt-12 flex-col gap-3 items-center'>
            <Image source={{ uri: manga.coverImage.extraLarge }} className='w-full h-96 rounded-md' resizeMode='contain' />
            <View className='flex-row items-center justify-between w-full'>
              <Text className='text-2xl text-left font-bold w-[70%]' numberOfLines={2}>{language === "English" && manga.title.english ? manga.title.english : (manga.title.romaji ? manga.title.romaji : manga.title.native)}</Text>
              <TouchableOpacity>
                <Ionicons name='heart' size={24} color={"white"} className='bg-gray-500 p-3 rounded-full' />
              </TouchableOpacity>
            </View>
            <Text className='text-center text-gray-500 text-xl mt-3'>Manga Information</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className='rounded-2xl py-4 px-10 shadow-slate-400'>
                <View className='flex-col gap-1'>
                  <Text></Text>
                  <Text></Text>
                  </View>
                <View className='flex-col gap-1'>
                  <Text></Text>
                  <Text></Text>
                  </View>
                <View className='flex-col gap-1'>
                  <Text></Text>
                  <Text></Text>
                  </View>
              </View>
            </ScrollView>
          </View>
        )
        :
        (<Text>Loading...</Text>)}
    </View>
  )
}

export default Manga