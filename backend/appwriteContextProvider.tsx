import React, {createContext, useContext, useState} from 'react'
import { useAppwrite } from './useAppwrite';
import { getUser } from './appwrite'

interface User {
    $id: string,
    name: string,
    email: string
}

interface AppWriteContextType {
    user: User | null;
    isLoggedIn: boolean;
    loading: boolean;
    refetch: () => Promise<void>;
}

const AppwriteContext = createContext<AppWriteContextType | undefined>(undefined);

export const AppwriteContextProvider = ({children} : {children: React.ReactNode}) => {
  
    const {data: user, loading, error, refetch} = useAppwrite({fn: getUser})

    const isLoggedIn = !!user;
    // !null => !true => false
    // !{name: "John"} => !false = true
    
    return (
        <AppwriteContext.Provider value={{user, isLoggedIn, loading, refetch}}>
            {children}
        </AppwriteContext.Provider>
    )

}

export const useAppwriteContext = () => {
    const context = useState(AppwriteContext);
    if (!context) {
        throw new Error('useAppwriteContext must be used within a AppwriteContextProvider');
    }
    return context;
}