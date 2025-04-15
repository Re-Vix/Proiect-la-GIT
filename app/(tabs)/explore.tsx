import { View, Text, TouchableOpacity, TextInput } from 'react-native'
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
  const [hasNextPage, setHasNextPage] = useState(true)
  const route = useRoute()
  const searchQuery = route.params || ""

  const getMangasFromAPI = async () => {
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

        setMangas(response.data.Page.media);
        setHasNextPage(response.data.Page.pageInfo.hasNextPage)

      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }

  useEffect(() => {
    getMangasFromAPI()
  }, [page])



  return (
    <View className='flex-1 px-4 my-4'>
      <View className='flex-row items-center gap-2 bg-gray-100 px-6 py-2 rounded-full w-[80%] relative'>
        <TouchableOpacity>
          <Ionicons name='search-outline' size={24} color='black' />
        </TouchableOpacity>
        <TextInput placeholder='Search...' className='flex-1 ml-2 text-gray-700' onChangeText={setSearch} value={search} />
      </View>
      {
        mangas.map((manga: any, index: number) => (
          <View key={index} className='mt-2'>
            <Text>{manga.title.romaji}</Text>
            <Text>{manga.title.english}</Text>
          </View>
        ))
      }
      <TouchableOpacity onPress={() => setPage(page + 1)}>
        <Text>Load More</Text>
      </TouchableOpacity>
    </View>
  )
}

