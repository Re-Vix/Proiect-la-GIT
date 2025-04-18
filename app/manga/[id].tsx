import { View, Text, Alert, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { getMangaByIdQueryAndVariables } from "@/backend/useAnilistAPI"
import { useState, useEffect } from 'react'
import { database, databaseId, userDataCollection, account, favouritesCollection, statusCollection } from '@/backend/appwrite'
import { ID } from 'react-native-appwrite'
import { router } from 'expo-router'
import { Dropdown } from 'react-native-element-dropdown'
import { Ionicons } from '@expo/vector-icons'
import { Query } from 'react-native-appwrite'


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

  const [favoriteId, setFavoriteId] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<any>("")
  const [statusId, setStatusId] = useState<any>(null)
  // console.log(id);

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
      checkFavorite(user.$id);
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
    checkStatus(accountId, manga?.id)
  }, [])

  const checkExistsUserData = async () => {
    if (userDatas && userDatas.length > 0) {
      // console.log(accountId);
      const existing = userDatas.find((userData: any) => userData.UserID?.toString().trim() === accountId?.toString().trim());
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


  // Status

  const checkStatus = async (userId: string, mangaId: string) => {
    // console.log(userId);
    try {
      const response = await database.listDocuments(
        databaseId,
        statusCollection,
        [
          Query.equal('UserID', userId)
        ]
      )
      if (response.documents.length > 0) {
        // console.log("yes");
        setCurrentStatus(response.documents[0].Status)
        setStatusId(response.documents[0].$id)
      }
    } catch (error) {
      console.error(error)
    }
  }


  const handleChangeMangaStatus = async (status: string) => {
    if (statusId) {
      try {
        await database.updateDocument(databaseId, statusCollection, statusId, { Status: status })
        setCurrentStatus(status)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const response = await database.createDocument(
          databaseId,
          statusCollection,
          ID.unique(),
          {
            MangaID: id,
            UserID: accountId,
            Status: status
          }
        )
        setCurrentStatus(status)
        setStatusId(response.$id)
      } catch (error) {
        console.error(error)
      }
    }
  }




  // Favorites

  const checkFavorite = async (userId: string) => {
    // console.log(userId);
    try {
      const response = await database.listDocuments(
        databaseId,
        favouritesCollection,
        [
          Query.equal('MangaID', id),
          Query.equal('UserID', userId)
        ]
      )
      if (response.documents.length > 0) {
        // console.log("yes");
        setIsFavorite(true)
        setFavoriteId(response.documents[0].$id)
      }
    } catch (error) {
      console.error(error)
    }
  }


  const handleFavorite = async () => {
    if (isFavorite) {
      try {
        await database.deleteDocument(databaseId, favouritesCollection, favoriteId)
        setIsFavorite(false)
        setFavoriteId('')
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const response = await database.createDocument(
          databaseId,
          favouritesCollection,
          ID.unique(),
          {
            MangaID: id,
            UserID: accountId
          }
        )
        setIsFavorite(true)
        setFavoriteId(response.$id)
      } catch (error) {
        console.error(error)
      }
    }
    setIsFavorite(!isFavorite);
  }



  return (
    <View className='flex-1 my-4'>
      <Ionicons name='arrow-back' className='absolute top-3 left-3 z-10 bg-gray-100 rounded-full p-4' size={25} onPress={() => router.back()} />
      <ScrollView className='z-100 p-4' showsVerticalScrollIndicator={false}>
        {/* <Text>{Number(id)}</Text> */}

        {error ? (<Text>{error}</Text>) : manga ?
          (
            <View className='mt-12 flex-col gap-3 items-center'>
              <Image source={{ uri: manga.coverImage.extraLarge }} className='w-full h-96 rounded-md' resizeMode='contain' />
              <View className='flex-row items-center justify-between w-full'>
                <Text className='text-2xl text-left font-bold w-[70%]' numberOfLines={2}>{language === "English" && manga.title.english ? manga.title.english : (manga.title.romaji ? manga.title.romaji : manga.title.native)}</Text>
                <TouchableOpacity onPress={() => handleFavorite()}>
                  <Ionicons name='heart' size={24} color={"white"} className={`p-3 rounded-full ${isFavorite ? "bg-[#A2B2FC]" : "bg-gray-500"}`} />
                </TouchableOpacity>
              </View>
              <Text className='text-center text-gray-500 text-xl mt-3'>Manga Information</Text>
              <View>
                <View className='py-4 px-6 shadow-slate-400 flex-row justify-between items-center w-full border border-gray-300 rounded-3xl'>
                  <View className='flex-col gap-1 border-r-gray-400 border-r pr-5'>
                    <Text className='text-center text-2xl'>{manga.averageScore} / 100</Text>
                    <Text className='text-center text-gray-500'>Rating</Text>
                  </View>
                  <View className='flex-col gap-1 border-r-gray-400 border-r pr-5'>
                    <Text className='text-center text-2xl'>{manga.volumes ? manga.volumes : "Ongoing"}</Text>
                    <Text className='text-center text-gray-500'>Nr. of Volumes</Text>
                  </View>
                  <View className='flex-col gap-1'>
                    <Text className='text-center text-2xl'>{manga.chapters ? manga.chapters : "Ongoing"}</Text>
                    <Text className='text-center text-gray-500'>Nr. of Chapters</Text>
                  </View>
                </View>
                <View>
                  <Text className='text-left text-gray-400 text-sm mt-3'>Native language name: </Text>
                  <Text className='text-left text-gray-600 text-lg'>{manga.title.native}</Text>
                </View>
                <View>
                  <Text className='text-left text-gray-400 text-sm mt-3'>Genres: </Text>
                  <Text className='text-left text-gray-600 text-lg'>{manga.genres.join(", ")}</Text>
                </View>
                <View>
                  <Text className='text-left text-gray-400 text-sm mt-3'>Description: </Text>
                  <Text className='text-left text-gray-600 text-lg'>{manga.description ? manga.description.split(/<a[^>]*>.*?<\/a>/g).join(" ").split(/<\/?[^>]+>/g).join(" ") : "No description available"}</Text>
                </View>
              </View>
            </View>
          )
          :
          (<Text className='text-center text-4xl text-gray-400 mt-12'>Loading...</Text>)}
      </ScrollView>
      <TouchableOpacity className='w-full flex-row justify-between bg-[#a8b4fc] py-4 px-8 rounded-full items-center absolute bottom-10'>
        <Text className='text-white text-xl'>Manga Status:</Text>
        <Dropdown
          data={status}
          onChange={(status) => handleChangeMangaStatus(status.value)}
          search={false}
          labelField="label"
          valueField="value"
          value={currentStatus}
          style={
            {
              width: 200,
              padding: 4,
            }
          }
          placeholderStyle={
            {
              padding: 4
            }
          }
          itemContainerStyle={
            {
              padding: 4
            }
          }
          selectedTextStyle={
            {
              padding: 4,
              fontSize: 18,
              color: 'white'
            }
          }
        />
      </TouchableOpacity>
    </View>
  )
}

export default Manga