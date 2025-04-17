import { View, Text, Alert } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { getMangaByIdQueryAndVariables } from "@/backend/useAnilistAPI"
import { useState, useEffect } from 'react'
import { database, databaseId, userDataCollection, account } from '@/backend/appwrite'
import { ID } from 'react-native-appwrite'
import { router } from 'expo-router'


const Manga = () => {
    const { id } = useLocalSearchParams()

    const [language, setLanguage] = useState("English")
    const [manga, setManga] = useState<any>(null)
    const [error, setError] = useState<any>(null)
    const [accountId, setAccountId] = useState("");
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

    const checkExistsUserData = async () => {
      if (userDatas && userDatas.length > 0) {
        const existing = userDatas.find(userData => userData.UserID?.toString().trim() === accountId?.toString().trim());
        return existing || null;
      }
      return null;
    };
  

    useEffect(() => {

      const createOrUpdateUserData = async () => {
        try {
          const existingUserData = await checkExistsUserData();
      
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
    }, [accountId, userDatas])


  return (
    <View>
      <Text>{Number(id)}</Text>
      {error ? (<Text>{error}</Text>) : manga ? (<Text>{manga.title.romaji}</Text>) : (<Text>Loading...</Text>)}
    </View>
  )
}

export default Manga