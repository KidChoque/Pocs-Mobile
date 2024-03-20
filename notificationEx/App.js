import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

//Import of library resources
import * as Notifications from 'expo-notifications'

//Allow permissions for notification when loading app
Notifications.requestPermissionsAsync()

// To define how notifications will be treat when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shows an alert when notification sent 
    shouldShowAlert:true,

    //emits a sound when notification sent
    shouldPlaySound:true  ,

    //shows an icon that represents your number of notifications
    shouldSetBadge:true
  })
})

export default function App() {

//function to notification request
const handleCallNotifications=  async () => {

  //Cares permission status 
  const {status} = await Notifications.getPermissionsAsync();

  if (status !== "granted"){
    alert("You didn't turn your notifications on");
    return;
  }


  //cares the notification's token
  const token = await Notifications.scheduleNotificationAsync({
    content:{
      title:"Look ur Notifications",
      body: "Creating a POC to implement expo notifications",
    },
    trigger:{seconds: 5}
  })
}


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={handleCallNotifications}>
        <Text>CLICK TO SEND NOTIFICATION</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
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

  btn: {

    height: 100,
    width: '80%',
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:30
  }
});