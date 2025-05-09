import axios from "axios";
import { useState } from "react";

export async function getQueryAndVariables(page: number = 1, perPage: number = 10, search: string = "", genre: string = "", sort: string = "SCORE", order: string = "DESC") {
  var query = `
query ($id: Int, $page: Int, $perPage: Int, $search: String, $genre: String) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      currentPage
      hasNextPage
      perPage
      total
    }
    media(id: $id, type: MANGA, search: $search, genre: $genre, sort: ${sort + (order === "DESC" ? "_DESC" : "")}, isAdult: false) {
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
    }
  }
}


`;

  var variables = {
    page: page,
    perPage: perPage,
    search: search != "" ? search : null,
    genre: genre != "" ? genre : null,
  };

  return { query, variables };

}


export async function getMangaByIdQueryAndVariables(id: number) {
  const query = `query ($id: Int) {
    Media(id: $id, type: MANGA){
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
      genres
      averageScore
      favourites
      status
    }
  }`

  const variables = {
    id: id
  }

  return { query, variables };
}