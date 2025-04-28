import { StatusBar } from 'expo-status-bar';
import { StyleSheet,TouchableOpacity, Text, Image, Button, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const logoImg= require("../assets/logo.png")

export default function welcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={logoImg} style={{width:121,height:121} }/>
      <Text style={{  fontSize: 30,fontWeight: 'bold',color: 'white',} }>Hokoki ai </Text>
      <StatusBar style="auto" />
      <Text style={{  lineHeight: 24, textAlign:"center",marginHorizontal: 45 ,fontSize: 22,color: 'white',} }>Algeria’s AI-Powered Legal Assistant</Text>
      <TouchableOpacity 
  style={{
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 88,
    width: 193,
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, 
  }}
  onPress={() => navigation.navigate('Onboarding')}
>

  <Text style={{ color: '#003366', fontSize: 18, fontWeight: 'bold' }}>
  Let’s get started     
  </Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366',
    gap:34,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
