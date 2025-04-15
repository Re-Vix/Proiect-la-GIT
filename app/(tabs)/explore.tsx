import { View, Text, TouchableOpacity } from 'react-native'
import { getQueryAndVariables } from '@/backend/useAnilistAPI'
import { useState, useEffect } from 'react'


const mangasPerPage = 5;

export default function explore() {

  const [mangas, setMangas] = useState<any>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")

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

      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }

  useEffect(() => {
    getMangasFromAPI()
  }, [])



  return (
    <View>
      {
        mangas.map((manga: any, index: number) => (
          <Text key={index}>{manga.title.romaji}</Text>
        ))
      }
    </View>
  )
}

