import axios from "axios";
import { useState } from "react";

export async function getMangas(page: number = 1, perPage: number = 10, search: string = "", genre: string = "") {
var query = `
query ($id: Int, $page: Int, $perPage: Int, $search: String, $genre: String) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      currentPage
      hasNextPage
      perPage
      total
    }
    media(id: $id, type: MANGA, search: $search, genre: $genre) {
      id
      title {
        english
        romaji
        native
      }
      coverImage {
        extraLarge
        color
      }
      volumes
      chapters
      description
      rankings {
        id
      }
      genres
    }
  }
}


`;

var variables = {
    page: page,
    perPage: perPage, 
    search: search != "" ? search : null,
    genre: genre != "" ? genre : null
};

const [mangas, setMangas] = useState<any>();

const fetchData = async () => {
    try {
        await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })}).then(response => response.json())
        .then(data => {
            setMangas(JSON.stringify(data.data.Page.media));
        }
        );
    
    
    } catch (error) {
        console.log(error);
    }
}

fetchData();

return mangas

}


