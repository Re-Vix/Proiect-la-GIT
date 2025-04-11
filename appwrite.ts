import { Client, Account, ID } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67f94b4500302fe61dde')
    .setPlatform('com.mangapp');