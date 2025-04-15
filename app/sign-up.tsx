import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from "react-native";
import { useState, useEffect } from "react";
import { account } from "@/backend/appwrite";
import { ID } from "react-native-appwrite";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { handleSignInGoogle } from "@/backend/appwrite";
import { useAppwriteContext } from "@/backend/appwriteContextProvider";
import { Link } from "expo-router";

const SignUp = () => {

    const {loading, isLoggedIn} = useAppwriteContext();
    if(!loading && isLoggedIn) return router.replace('/(tabs)/main')

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
    <KeyboardAvoidingView className="flex-1  items-center gap-8">
    <View className='flex flex-col gap-2 top-20'>
                <Text className='text-[#424242] text-[40px] text-center'>Welcome</Text>
                <Text className='text-[#9D9D9D] text-[18px] text-center'>Sign in to start</Text>
            </View>
            <View className='mt-24 flex items-center justify-center'>
                <TouchableOpacity className='rounded-full border-gray-200 border flex flex-row gap-4 items-center justify-center px-6 py-3'>
                    <Image source={{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png'}} className='w-[24px] h-[24px]'/>
                    <Text className='text-[18px]'>Continue with Google</Text>
                </TouchableOpacity>
                <Text className='mt-8 text-[18px]'>Already have an account?<Link className='text-blue-500 text-[18px]' href={'/login'}> Login!</Link></Text>
    </View>

<View className='bg-[#A2B2FC] w-full h-[55vh] rounded-t-[24px] absolute bottom-0 flex items-center gap-6'>

    <View className="relative w-[90%] mt-24">
    <TextInput 
        className="border-b-2 border-white rounded-md px-4 py-5 w-full text-white  text-[18px]" 
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
        className="border-b-2 border-white rounded-md px-4 py-5 w-full text-white  text-[18px]" 
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
        className="border-b-2 border-white rounded-md px-4 py-5 w-full text-white  text-[18px]" 
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
        className={`${isNameValid && isEmailValid && isPasswordValid ? "bg-[#424242]" : "bg-[#9D9D9D]"} px-7 rounded-full py-4 w-[90%] mt-10`}
        onPress={handleSignUp}
        disabled={!isEmailValid || !isNameValid || !isPasswordValid}
      >
        <Text className="text-white text-xl text-center">Create Account</Text>
      </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
