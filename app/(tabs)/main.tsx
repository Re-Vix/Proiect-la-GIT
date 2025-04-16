import { View, Text, Alert, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import { Avatars } from 'react-native-appwrite'
import { client } from '@/backend/appwrite'
import { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { account } from '@/backend/appwrite'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { getQueryAndVariables } from '@/backend/useAnilistAPI'
import { router } from 'expo-router'

const main = () => {

  const [avatarURI, setAvatarURI] = useState("")
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    const avatars = new Avatars(client);
    const result = avatars.getInitials(accountName);
    setAvatarURI(result.toString())
  }, [accountName])


  useEffect(() => {
    const fetchAccount = async () => {
        const user = await account.get();
        setAccountName(user.name); 
    };

    fetchAccount();
  }, []);

  const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
      navigation.navigate('explore', { searchQuery });
    };

      const [mangas, setMangas] = useState<any>([])
      const [hasNextPage, setHasNextPage] = useState(true)
    
      const getMangasFromAPI = async () => {
        const { query, variables } = await getQueryAndVariables(1, 10);
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
      }, [])
 
  return (
    <View>
      <View className='flex flex-row px-4 justify-between mt-6 items-center'>
        <View className='flex flex-row gap-3 items-center'>
          <Link href={'/user'}>
            <Image className='w-16 h-16 rounded-full' source={{ uri: avatarURI }} />
          </Link>
          <Text className='text-[20px]'>{accountName}</Text>
        </View>
        <Ionicons name='settings-outline' size={30}/>
      </View>
      <View className='flex-row items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 mt-4 w-[80%] mx-auto'>
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name='search-outline' size={24} color='black' />
        </TouchableOpacity>
        <TextInput placeholder='Search...' className='flex-1 ml-2 text-gray-700' onChangeText={setSearchQuery} value={searchQuery} />
        </View>
        <Text className='text-[20px]'>Trending Mangas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {
            mangas.map((manga: any, index: number) => (
              <TouchableOpacity key={index} className='w-[200px] mt-4 flex-col gap-2 px-3 py-5 rounded-lg bg-white shadow-md mr-4' onPress={() => { router.push("/main") }}>
                <Image source={{ uri: manga.coverImage.extraLarge }} className='h-64 rounded-lg' resizeMode='contain' />
                <View className='flex-col gap-1'>
                  <Text className='font-bold text-xl w-[160px] truncate' numberOfLines={1}>{manga.title.english ? manga.title.english : (manga.title.romaji ? manga.title.romaji : manga.title.native)}</Text>
                  <Text className={`text-sm text-gray-400 w-[160px] truncate ${!manga.title.romaji ? "hidden" : ""}`} numberOfLines={1}>{manga.title.english ? manga.title.romaji : (manga.title.romaji ? manga.title.native : "")}</Text>
                </View>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
    </View>
  )
}

export default main