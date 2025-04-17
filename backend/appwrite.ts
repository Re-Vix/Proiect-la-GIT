import { Client, Account, ID, OAuthProvider, Databases } from 'react-native-appwrite';
import * as Linking from 'expo-linking'
import {openAuthSessionAsync} from 'expo-web-browser'
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useState } from 'react';

export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67f94b4500302fe61dde')
    .setPlatform('com.mangapp');

export const database = new Databases(client);
export const account = new Account(client);
export const databaseId = '68011164001ef8055ba5'
export const statusCollection = '6801118d001e35c0b735'
export const favouritesCollection = '6801118200298a068d89'
export const userDataCollection = '6801117800286b743b23'

export async function login() {
    try {
        const redirectUrl = Linking.createURL("/");
        const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUrl);
        if (!response) throw new Error("Create OAuth token failed");

        const browserResult = await openAuthSessionAsync(response.toString(), redirectUrl);
        if (browserResult.type !== "success") {
            throw new Error("Create OAuth token failed");
        }

        const url = new URL(browserResult.url);
        const secret = url.searchParams.get("secret")?.toString();
        const userId = url.searchParams.get("userId")?.toString();

        if (!userId || !secret) throw new Error("Create OAuth token failed");

        const session = await account.createSession(userId, secret);
        if (!session) throw new Error("Failed to create session");

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getUser() {
    try {
        const result = await account.get();
        if(result){
            return result
        }
        return null
    } catch (error) {
        console.error(error);
        return null
    }
}

export async function handleSignInGoogle()  {
    const result = await login()
    if(result) {
      router.push('/(tabs)/main')
    } else{
      Alert.alert("Error")
    }
  }