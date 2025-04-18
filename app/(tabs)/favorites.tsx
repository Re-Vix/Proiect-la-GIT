import { View, Text, Alert, ScrollView, TouchableOpacity, Image } from 'react-native'
import { database, databaseId, favouritesCollection, account } from '@/backend/appwrite'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'


const favorites = () => {

  const [favourites, setFavourites] = useState([])
  const [language, setLanguage] = useState("")
  const [accountId, setAccountId] = useState("")
  const [userDatas, setUserDatas] = useState([])

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
                const fetchAccount = async () => {
                    const user = await account.get();
                    setAccountId(user.$id); 
                };
            
                fetchAccount();
              }, []);
  
      useEffect(() => {
        if (userDatas && userDatas.length > 0) {
          const getCurrentUserLanguagePreference = () => {
            const currentUserData = userDatas.find(user => user.UserID === accountId);
            setLanguage(currentUserData?.LanguagePreference || null);
          };
      
          getCurrentUserLanguagePreference();
        }
      }, [userDatas]);

  useEffect(() => {
        const fetchFavourites = async () => {
          try{
            const response = await database.listDocuments(databaseId, favouritesCollection)
            if (response) {
              setFavourites(response.documents)
            }
          } catch(e:any) {
            console.error(e)
            Alert.alert("Error", e.message);
          }
        } 
        fetchFavourites();
      }, [])

  return (
    <ScrollView showsVerticalScrollIndicator={false} className='mt-4'>
            <View className='flex-row flex-wrap justify-between'>
              {
                favourites.length != 0 ? favourites.map((manga: any, index: number) => (
                  <TouchableOpacity key={index} className='mt-4 flex-col gap-2 w-[48%] px-3 py-5 bg-white rounded-lg shadow-md' onPress={() => { router.push(`/manga/${manga.id}`) }}>
                    <Image source={{ uri: manga.coverImage.extraLarge }} className='h-64 rounded-lg' resizeMode='contain' />
                    <View className='flex-col gap-1'>
                    <Text className='font-bold text-xl w-[160px] truncate' numberOfLines={1}>{language === "English" && manga.title.english ? manga.title.english : (manga.title.romaji ? manga.title.romaji : manga.title.native)}</Text>
                    <Text className={`text-sm text-gray-400 w-[160px] truncate ${!manga.title.romaji ? "hidden" : ""}`} numberOfLines={1}>{manga.title.native}</Text>
                    </View>
                  </TouchableOpacity>
                )) : <Text className='text-center text-4xl font-bold w-full mt-10'>No results found</Text>
              }
            </View>
          </ScrollView>
  )
}

export default favorites