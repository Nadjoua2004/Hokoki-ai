import { StatusBar } from 'expo-status-bar';
import { StyleSheet,TouchableOpacity, Text, Image, Button, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const logoImg= require("./assets/logo.png")

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={logoImg} style={{width:121,height:121} }/>
      <Text style={{  fontSize: 30,fontWeight: 'bold',color: 'white',} }>Hokoki ai </Text>
      <StatusBar style="auto" />
      <Text style={{  lineHeight: 24, marginHorizontal: 65 ,fontSize: 19,fontWeight: 'bold',color: 'white',} }>Le premier assistant juridique alimenté par l'IA en Algérie</Text>
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
  onPress={() => console.log('worked!')}
>

  <Text style={{ color: '#003366', fontSize: 18, fontWeight: 'bold' }}>
    Allons-y        <Icon name="arrow-right" size={18} color="#003366" style={{ marginRight: 10 }} />
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
