import { Stack } from "expo-router";
import "./global.css"
import { AppwriteContextProvider } from "@/backend/appwriteContextProvider";

export default function RootLayout() {
  return (
    <AppwriteContextProvider>
      <Stack screenOptions={{headerShown: false}}/>;
    </AppwriteContextProvider>
  )
}
