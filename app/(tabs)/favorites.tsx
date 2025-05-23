import { View, Text, Alert, ScrollView, TouchableOpacity, Image } from 'react-native'
import { database, databaseId, favouritesCollection, account } from '@/backend/appwrite'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { getMangaByIdQueryAndVariables } from '@/backend/useAnilistAPI'
import { userDataCollection } from '@/backend/appwrite'
import { Query } from 'react-native-appwrite'


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
                    fetchFavourites(user.$id);
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



      const fetchFavourites = async (currentUserId: string) => {
        try{
          const response = await database.listDocuments(databaseId, favouritesCollection, [Query.equal("UserID", currentUserId)])
          if (response) {
            setFavourites(response.documents)
          }
        } catch(e:any) {
          console.error(e)
          Alert.alert("Error", e.message);
        }
      } 



    const [favouritesData, setFavouritesData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        const fetchFavourites = async () => {
          const results = [];
      
          for (const favourite of favourites) {
            const { query, variables } = await getMangaByIdQueryAndVariables(favourite.MangaID);
      
            try {
              const response = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
                body: JSON.stringify({ query, variables }),
              });
      
              const result = await response.json();
      
              if (result.data) {
                results.push(result.data.Media);
              } else {
                setError("Error: Manga not found");
              }
            } catch (error) {
              console.error(error);
              setError("Error fetching manga");
            }
          }
      
          setFavouritesData(results);
        };
      
        if (favourites.length > 0) {
          fetchFavourites();
        }
      }, [favourites]);
    
        

  return (
    <ScrollView showsVerticalScrollIndicator={false} className='mt-4 p-4'>
            <View className='flex-row flex-wrap justify-between'>
              {
                favouritesData.length != 0 ? favouritesData.map((manga: any, index: number) => (
                  <TouchableOpacity key={index} className='mt-4 flex-col gap-2 w-[48%] px-3 py-5 bg-white rounded-lg shadow-md' onPress={() => { router.push(`/manga/${favourites[index].MangaID}`) }}>
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