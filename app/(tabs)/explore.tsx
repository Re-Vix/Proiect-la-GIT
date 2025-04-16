import { View, Text, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native'
import { getQueryAndVariables } from '@/backend/useAnilistAPI'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';


const mangasPerPage = 8;

export default function explore() {

  const [mangas, setMangas] = useState<any>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")
  const [hasNextPage, setHasNextPage] = useState(false)

  const route = useRoute()
  const { searchQuery } = route.params || ""


  const getMangasFromAPI = async (search: string = "") => {
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
        setMangas(response.data.Page.media);
        setHasNextPage(response.data.Page.pageInfo.hasNextPage)

      } catch (error) {
        console.log(error);
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
    getMangasFromAPI(search)
  }, [page])


  const handleSearch = (text: string) => {
    setPage(1)
    setSearch(text)
    getMangasFromAPI(text)
  }

  return (
    <View className='flex-1 px-4 my-4'>
      <View className='flex-row items-center gap-2 bg-gray-100 px-6 py-2 rounded-full w-[80%] sticky'>
        <TouchableOpacity>
          <Ionicons name='search-outline' size={24} color='black' />
        </TouchableOpacity>
        <TextInput placeholder='Search...' className='flex-1 ml-2 text-gray-700' onChangeText={handleSearch} value={search} />
      </View>

      <ScrollView>
        {
          mangas.map((manga: any, index: number) => (
            <View key={index} className='mt-2'>
              <Image source={{ uri: manga.coverImage.extraLarge }} className='h-64 rounded-lg' resizeMode='contain' />
              <Text>{manga.title.romaji}</Text>
            </View>
          ))
        }
      </ScrollView>

      <View className={'flex-row items-center justify-between w-full '}>
        <TouchableOpacity onPress={() => { if (page > 1) setPage(page - 1) }}>
          <Ionicons name='arrow-back' size={16}/>
        </TouchableOpacity>

        <Text>Page: {page}</Text>

        <TouchableOpacity onPress={() => { if (hasNextPage) setPage(page + 1) }}>
          <Ionicons name='arrow-forward' size={16}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

