import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { getMangaByIdQueryAndVariables } from "@/backend/useAnilistAPI"
import { useState, useEffect } from 'react'

const Manga = () => {
    const { id } = useLocalSearchParams()

    const [manga, setManga] = useState<any>(null)
    const [error, setError] = useState<any>(null)

    const getMangaFromAPI = async (search: string = "", genre: string = "") => {
        const { query, variables } = await getMangaByIdQueryAndVariables( Number(id) );
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
            if( response.data ){
              setManga(response.data.Media);
              setError(null)
            }
            else{
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


  return (
    <View>
      <Text>{Number(id)}</Text>
      <Text>{error ? error : manga.title.romaji}</Text>
    </View>
  )
}

export default Manga