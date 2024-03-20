import { StyleSheet, Text, View ,TouchableOpacity, Modal, Image, Alert} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import {FontAwesome} from '@expo/vector-icons'
import * as MediaLibrary from 'expo-media-library'

export default function App() {

  const cameraRef = useRef(null)
  const [photo,setPhoto] = useState(null)
  const [openModal,setOpenModal] = useState(false)
  const [tipoCamera,setTipoCamera] = useState(Camera.Constants.Type.front)

  
  async function CapturePhoto(){
    if(cameraRef){
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri)
      
      setOpenModal(true)
      
      console.log(photo)
    }
  }
  
  function ClearPhoto(){
    setPhoto(null)
    
    setOpenModal(false)
  }

  async function SavePhoto(){

    if (photo) {
      await MediaLibrary.createAssetAsync(photo)
      .then( () => {
        alert("Sucess","Picture uploaded on galery")
      }).catch(error => {
        alert("Error , photo is not saving")
      })
      
    }

  }
  
  useEffect(() => {
    (async () => {
      const {status:cameraStatus} = await Camera.requestCameraPermissionsAsync()

      const {status: mediaStatus} = await MediaLibrary.requestPermissionsAsync();
    })();
  },[])


  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={tipoCamera}

        ratio='16:9'
      >
        <View style={styles.viewFlip}>

        <TouchableOpacity style={styles.btnFlip} onPress={() => setTipoCamera( tipoCamera == CameraType.front ? CameraType.back : CameraType.front)}>
          <Text style={styles.txtFlip}>Trocar</Text>
        </TouchableOpacity>

          
        <TouchableOpacity style={styles.btnCapture} onPress={() => CapturePhoto()}>
            <FontAwesome name="camera" size={23} color={"#fff"}/>
        </TouchableOpacity>
        </View>

      </Camera>

      <Modal animationType='slide' transparent={false} visible={openModal}>

        <View style={{flex:1 , alignItems: 'center', justifyContent:'center',padding:30}}>

          <Image style={{width:'100%',height:500,borderRadius:10}}
          source={{ uri : photo }}
          />

          <View style={{margin:15,flexDirection:'row'}}>
                   <TouchableOpacity style={styles.btnCancel} onPress={() => ClearPhoto()}>
                        <FontAwesome name="trash" size={23} color={"red"}/>
                   </TouchableOpacity>

                   <TouchableOpacity style={styles.btnUpload} onPress={() => SavePhoto()}>
                        <FontAwesome name="save" size={23} color={"#121212"}/>
                   </TouchableOpacity>
          </View>
          
        </View>

      </Modal>
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
  camera: {
    flex: 1,
    width:"100%",
    height:"80%"
  },
  viewFlip : {
    flex: 1,
    backgroundColor:"transparent",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  btnFlip : {
  padding: 15
  },
  txtFlip: {
    fontSize: 20,
    color : '#ffff'
  },
  btnCapture: {
    margin: 20,
    padding: 20,
     borderRadius:15,
     backgroundColor:"#121212",
     alignItems: "center",
     justifyContent: "center"

  },
  btnCancel: {
    padding: 20,
    borderRadius:15,
    backgroundColor: 'transparent',
    alignItems: "center",
    justifyContent: "center"
  },
  btnUpload :{
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'transparent',
    alignItems: "center",
    justifyContent: "center"

  }


});
