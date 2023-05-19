import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';


export default function App() {

  //Variables donde se guarda los resutltados del api
  let [rpm, setRPM] = useState(0);
  let [temp, setTemp] = useState(0);
  let [peso, setPeso] = useState(0);

  const [number, onChangeNumber] = useState('');
  const [number1, onChangeNumber1] = useState(''); 


  //Cada cierto tiempo se realiza un GET dek API REST
  const loadData = useCallback(async()=>{

    try{
      const response = await fetch('http://192.168.1.1:80/valores');
      const dataJSON = await response.json();
      console.log(dataJSON);
      setRPM(Math.round(dataJSON.rpm));
      setTemp(Math.round(dataJSON.temp*10)/10);
      setPeso(Math.round(dataJSON.peso*100)/100);
    }catch(error){
      console.log(error);
    }

  }, []);

  //Configurar el useCallBack
  useEffect(()=>{
    const interval = setInterval(loadData, 1000);
    return() => clearInterval(interval);
  },[loadData]);


  const getRPM = () => {
    return <Text>RPM: {rpm} </Text>
  }

  const getTemp = () => {
    return <Text>Temp: {temp} </Text>
  }

  const getPeso = () => {
    return <Text>Peso: {peso} </Text>
  }

  //Text Input para RPM deseado
  const textRPM = () => {
    return <TextInput 
    style={styles.input}
    onChangeText={onChangeNumber}
    value={number}
    placeholder='RPM Nuevo'
    keyboardType='numeric'/> 
  }

  //PUT para rpm deseado
  const putRPM = () => {
    console.log("PUT RPM deseado")
    fetchWithTimeout('http://192.168.1.1:80/rpmDeseado', {
      method: 'PUT',
      timeout:1000,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({rpm:number})
    })
    .catch(function (err){
      console.log(err);  // Prints "Error: something went terribly wrong"
  });
  }

  //Boton para mandar PRM Deseado
  const buttonRPM = () => {
    return <Button
    title = "Cambiar RPM"
    onPress={() => {putRPM()}}/>
  }


   //Text Input para peso deseado
   const textPeso = () => {
    return <TextInput 
    style={styles.input}
    onChangeText={onChangeNumber1}
    value={number1}
    placeholder='Peso a completar'
    keyboardType='numeric'/> 
  }


  //PUT para peso deseado
  const putPeso = () => {
    console.log("PUT Peso deseado")
    fetchWithTimeout('http://192.168.1.1:80/pesoDeseado', {
      method: 'PUT',
      timeout:1000,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({peso:number1})
    })
    .catch(function (err){
      console.log(err);  // Prints "Error: something went terribly wrong"
  });
  }

    //Boton para mandar PRM Deseado
    const buttonPeso = () => {
      return <Button
      title = "Cambiar Peso"
      onPress={() => {putPeso()}}/>
    }


//Estructura general de la pagina
  return (
    <View style={styles.container}>
      <View><Text style={styles.texto}>CHOCOLANDES</Text></View>
      <View>{getRPM()}</View>
      <View>{getTemp()}</View>
      <View>{getPeso()}</View>
      <View>{textRPM()}{buttonRPM()}</View>
      <View>{textPeso()}{buttonPeso()}</View>
  
    </View>
  );
}


//Poner estilos a los textos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },

  texto:{
    color: '#e042f5',
  }

});


//Para el put pero si no se recibe respuesta se termina la transaccion
async function fetchWithTimeout(resource, options = {}) {
  const {timeout = 8000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);
  return response;
}