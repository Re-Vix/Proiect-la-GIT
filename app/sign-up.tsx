import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from "react-native";
import { useState, useEffect } from "react";
import { account } from "@/backend/appwrite";
import { ID } from "react-native-appwrite";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SignUp = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false)

  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    const usernameRegex = /^[a-zA-Z0-9]{3,16}$/;
    setIsNameValid(usernameRegex.test(name));
  }, [name]);

  useEffect(() => {
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setIsPasswordValid(passwordRegex.test(password));
  }, [password]);

  const handleSignUp = async () => {
    if (!isNameValid)
    {
        Alert.alert("Error", "Invalid name!")
    } 
    else if (!isEmailValid)
      {
          Alert.alert("Error", "Invalid email!")
      }
    else if (!isPasswordValid)
        {
            Alert.alert("Error", "Invalid password!")
    }else {
      try {
        const response = await account.create(ID.unique(), email, password, name);
        console.log(response);
        Alert.alert("Success", "Your account has been created!");
        setName("")
        setEmail("")
        setPassword("")
        if(response) {
          router.push('/login')
        }
      } catch (error: any) {
        console.error(error);
        Alert.alert("Error", error.message);
      }
    }
    
  };

  return (
    <KeyboardAvoidingView className="flex-1 justify-center items-center gap-8">
    <View className="relative w-[90%]">
    <TextInput 
        className="border border-gray-400 rounded-md px-8 py-5 w-full" 
        placeholder="Username..." 
        value={name} 
        onChangeText={setName}
      />
      {
        isNameValid ? 
        <Ionicons className="absolute top-5 right-5" color="green" name="checkmark" size={24} /> :
        <Ionicons className="absolute top-5 right-5" color="red" name="close" size={24} />
      }
    </View>
      
      
    <View className="relative w-[90%]">
    <TextInput 
        className="border border-gray-400 rounded-md px-8 py-5 w-full" 
        placeholder="Email..." 
        value={email} 
        onChangeText={setEmail}
      />
      {
        isEmailValid ? 
        <Ionicons className="absolute top-5 right-5" color="green" name="checkmark" size={24} /> :
        <Ionicons className="absolute top-5 right-5" color="red" name="close" size={24} />
      }
    </View>
      
    <View className="relative w-[90%]">
    <TextInput 
        className="border border-gray-400 rounded-md px-8 py-5 w-full" 
        placeholder="Password..." 
        secureTextEntry={!showPassword}
        value={password} 
        onChangeText={setPassword}
      />
      {
        isPasswordValid ? 
        <Ionicons className="absolute top-5 right-5" color="green" name="checkmark" size={24} /> :
        <Ionicons className="absolute top-5 right-5" color="red" name="close" size={24} />
      }
      <TouchableOpacity className="absolute top-5 right-16" onPress={() => setShowPassword(!showPassword)}>
        {
            showPassword ? 
            <Ionicons name="eye-outline" size={24} />:
            <Ionicons  name="eye-off-outline" size={24} />
        }
      </TouchableOpacity>
    </View>
      
      <TouchableOpacity 
        className={`${isNameValid && isEmailValid && isPasswordValid ? "bg-blue-500" : "bg-gray-300"} px-7 rounded-lg py-4 w-[90%]`}
        onPress={handleSignUp}
        disabled={!isEmailValid || !isNameValid || !isPasswordValid}
      >
        <Text className="text-white text-xl text-center">Create Account</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
