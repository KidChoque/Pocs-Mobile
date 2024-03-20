import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';

import moment from 'moment';

export default function App() {

  const [history, setHistory] = useState({})
  const [authenticated,setAuthenticated] = useState(false)
  const [biometryExist,setBiometryExist] = useState(false)

  async function CheckExistAuthentication(){
    //Validar se o aparelho tem o acesso a biometria
    const compatible = await LocalAuthentication.hasHardwareAsync()

    setBiometryExist(compatible)

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
    console.log(LocalAuthentication.AuthenticationType[types[0]]);
    
  }

  async function HandleAuthentication(){
    const biometry = await LocalAuthentication.isEnrolledAsync();

    if(!biometry){
      return Alert.alert(
        "Login Failed",
        "Authenticate biometry not find"
      )
    }

    const auth = await LocalAuthentication.authenticateAsync({promptMessage : "Login com biometria"})
    setAuthenticated(auth.success)

    if (auth.success) {
      SetHistory()
    }
  }

  async function SetHistory(){
    const objAuth = {
      dateAuthenticate : moment().format("DD/MM/YYYY HH:mm:ss")
    }
    await AsyncStorage.setItem("authenticate", JSON.stringify(objAuth))

    setHistory(objAuth)
  }

  async function GetHistory(){
    const objAuth= await AsyncStorage.getItem("authenticate")

    if (objAuth) {
      setHistory(JSON.parse(objAuth))
    }
  }

  useEffect(() => {
    CheckExistAuthentication();

    GetHistory()
  },[])
  return (


    <View style={styles.container}>
      <Text style={styles.title}>
        {biometryExist ? `Your dispositive is compatible with biometry` : 
      ' Your dispositve doesn t support biometry '}
      </Text>

      <TouchableOpacity style={styles.btnAuth} onPress={HandleAuthentication}>
        <Text style={styles.txtAuth} >Autenticar Acesso</Text>
      </TouchableOpacity>

      <Text style={[styles.textReturn,{color : authenticated ? "green" : "red" }]}>
        {authenticated ? "Autenticated" : "Not autenticated"}
      </Text>

      {
        history.dateAuthenticate ? 
        <Text style={styles.txtHistory}>
          Ultimo Acesso em {history.dateAuthenticate}
        </Text>

        : null

      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    fontSize:20,
    textAlign:"center",
    lineHeight:30,
    width:"70%"
  },
  btnAuth:{
    padding:16,
    borderRadius:15,
    margin:20,
    backgroundColor:"#ff8800"
  },
  txtAuth:{
    color:"#fff",
    fontSize:20,
    fontWeight:'bold'
  },
  textReturn:{
    fontSize:22,
    textAlign:"center",
    marginTop: 50
  },
  txtHistory:{
    fontSize:16,
    fontWeight:"bold",
    color:"#858383",
    position:"absolute",
    bottom:120
  }
});
