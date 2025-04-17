import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, Alert } from 'react-native'
import { getQueryAndVariables } from '@/backend/useAnilistAPI'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import { Dropdown } from "react-native-element-dropdown"
import { database, databaseId, userDataCollection, account } from '@/backend/appwrite';

const mangasPerPage = 12;
const genres = [
  { label: 'All', value: '' },
  { label: 'Action', value: 'Action' },
  { label: 'Adventure', value: 'Adventure' },
  { label: 'Comedy', value: 'Comedy' },
  { label: 'Drama', value: 'Drama' },
  { label: 'Ecchi', value: 'Ecchi' },
  { label: 'Fantasy', value: 'Fantasy' },
  { label: 'Horror', value: 'Horror' },
  { label: 'Mahou Shoujo', value: 'Mahou Shoujo' },
  { label: 'Mecha', value: 'Mecha' },
  { label: 'Music', value: 'Music' },
  { label: 'Mystery', value: 'Mystery' },
  { label: 'Psychological', value: 'Psychological' },
  { label: 'Romance', value: 'Romance' },
  { label: 'Sci-Fi', value: 'Sci-Fi' },
  { label: 'Slice of Life', value: 'Slice of Life' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Supernatural', value: 'Supernatural' },
  { label: 'Thriller', value: 'Thriller' }
]


export default function explore() {

  const [mangas, setMangas] = useState<any>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")
  const [hasNextPage, setHasNextPage] = useState(false)
  const [nrOfMangas, setNrOfMangas] = useState(0)
  const [userDatas, setUserDatas] = useState([])
  const [language, setLanguage] = useState("")
  const [accountId, setAccountId] = useState("")

  const route = useRoute()
  const { searchQuery } = route.params || ""


  const getMangasFromAPI = async (search: string = "", genre: string = "") => {
    const { query, variables } = await getQueryAndVariables(page, mangasPerPage, search, genre);
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
        // console.log(response)
        setMangas(response?.data.Page.media);
        setHasNextPage(response?.data.Page.pageInfo.hasNextPage);
        setNrOfMangas(response?.data.Page.pageInfo.total)
      } catch (error) {
        console.log(error);
        setMangas([])
        setHasNextPage(false)
        setNrOfMangas(0)
      }
    }
    fetchData();
  }

  useEffect(() => {
    if (searchQuery != "") setSearch(searchQuery)
    getMangasFromAPI(searchQuery)
    setPage(1)
  }, [searchQuery])


  useEffect(() => {
    getMangasFromAPI(search, genre)
  }, [page])


  const handleSearch = (text: string) => {
    setPage(1)
    setSearch(text)
    getMangasFromAPI(text, genre)
  }

  const handleChangeGenre = (genre: string) => {
    setPage(1)
    setGenre(genre)
    getMangasFromAPI(search, genre)
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

        useEffect(() => {
          const fetchAccount = async () => {
              const user = await account.get();
              setAccountId(user.$id); 
          };
      
          fetchAccount();
        }, []);

  return (
    <View className='flex-1 px-4 my-4'>
      <View className='flex-row items-center gap-2 bg-gray-100 px-6 py-2 w-full sticky border rounded-full mx-auto'>
        <TouchableOpacity>
          <Ionicons name='search-outline' size={24} color='black' />
        </TouchableOpacity>
        <TextInput placeholder='Search...' className='flex-1 ml-2 text-gray-700' onChangeText={handleSearch} value={search} />
      </View>

      <View className='flex-row justify-between items-center mt-5'>
        <Text className='text-[20px] font-bold'>Category: </Text>
        <Dropdown
          data={genres}
          onChange={(genre) => handleChangeGenre(genre.value)}
          search={false}
          labelField="label"
          valueField="value"
          value={genres[0].value}
          style={
            {
              width: 250,
              padding: 4,
              borderWidth: 1,
              borderRadius: 10,
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
              fontSize: 20
            }
          }
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className='mt-4'>
        <View className='flex-row flex-wrap justify-between'>
          {
            nrOfMangas != 0 ? mangas.map((manga: any, index: number) => (
              <TouchableOpacity key={index} className='mt-4 flex-col gap-2 w-[48%] px-3 py-5 bg-white rounded-lg shadow-md' onPress={() => { router.push(`/manga/${manga.id}`) }}>
                <Image source={{ uri: manga.coverImage.extraLarge }} className='h-64 rounded-lg' resizeMode='contain' />
                <View className='flex-col gap-1'>
                <Text className='font-bold text-xl w-[160px] truncate' numberOfLines={1}>{language === "English" ? manga.title.english : (manga.title.romaji ? manga.title.romaji : manga.title.native)}</Text>
                <Text className={`text-sm text-gray-400 w-[160px] truncate ${!manga.title.romaji ? "hidden" : ""}`} numberOfLines={1}>{manga.title.native}</Text>
                </View>
              </TouchableOpacity>
            )) : <Text className='text-center text-4xl font-bold w-full mt-10'>No results found</Text>
          }
        </View>
      </ScrollView>

      {
        nrOfMangas != 0 &&
        <View className={'flex-row items-center justify-between w-full mt-5 px-4'}>
          <TouchableOpacity onPress={() => { if (page > 1) setPage(page - 1) }} className={page == 1 ? "hidden" : ""}>
            <Ionicons name='arrow-back' size={18} />
          </TouchableOpacity>

          <Text className='font-bold text-xl'>Page: {page}</Text>

          <TouchableOpacity onPress={() => { if (hasNextPage) setPage(page + 1)}} className={hasNextPage ? "" : "hidden"}>
            <Ionicons name='arrow-forward' size={18} />
          </TouchableOpacity>
        </View>
      }
    </View>
  )
}

