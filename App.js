import { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";

export default function App() {
  //Variables donde se guarda los resutltados del api GET
  let [rpm, setRPM] = useState(0); //RPM actuales
  let [temp, setTemp] = useState(0); //Temperatura actual
  let [peso, setPeso] = useState(0); //Peso actual
  let [estado, setEstado] = useState("Encendido"); //Estado de funcionamiento

  //Variables para guardar los inputs con informacion de RPM y Peso deseado
  const [number, onChangeNumber] = useState(""); //RPM deseado
  const [number1, onChangeNumber1] = useState(""); //Peso desado

  //Cada cierto tiempo se realiza un GET del API REST
  const loadData = useCallback(async () => {
    try {
      const response = await fetch("http://192.168.1.103:80/valores");//IP de la esp
      const dataJSON = await response.json();
      console.log(dataJSON);
      setRPM(Math.round(dataJSON.rpm));//Asiganr valor de RPM a la variable de la app
      setTemp(Math.round(dataJSON.temp * 10) / 10);//Asiganr valor de temperatura a la variable de la app
      setPeso(Math.round(dataJSON.peso * 100) / 100); //Asiganr valor de peso a la variable de la app
      setEstado(dataJSON.estado); //Asiganr valor de estado a la variable de la app
    } catch (error) {
      console.log(error);//Avisa de cualquier error
    }
  }, []);

  //Configurar el useCallBack se realiza una llamada GET cada 1000ms
  useEffect(() => {
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  //Imprimir el texto con RPM actual en la pantalla
  const getRPM = () => {
    return <Text style={styles.labelText}>RPM: {rpm} rpm</Text>;
  };

  //Imprimir el texto con temperatura actual en la pantalla
  const getTemp = () => {
    return <Text style={styles.labelText}>Temp: {temp} °C</Text>;
  };


  //Imprimir el texto con peso actual en la pantalla
  const getPeso = () => {
    return <Text style={styles.labelText}>Peso: {peso} g</Text>;
  };

  //Imprimir el texto con el estado actual en la pantalla
  const getEstado = () => {
    return <Text style={styles.estiloEstadoTexto}>{estado}</Text>;
  }

  //Text Input para RPM deseado, maneja la caja de input del usuario
  const textRPM = () => {
    return (
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="RPM Nuevo"
        keyboardType="numeric"
      />
    );
  };

  //PUT para rpm deseado con el api REST
  const putRPM = () => {
    console.log("PUT RPM deseado");
    fetchWithTimeout("http://192.168.1.103:80/rpmDeseado", {
      method: "PUT",
      timeout: 1000,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rpm: number }),
    }).catch(function (err) {
      setEstado("Error");
      console.log(err); // Prints "Error: something went terribly wrong"
    });
  };

  //Boton para mandar PRM Desead
  const buttonRPM = () => {
    return (
      <Button
        style={styles.button}
        title="Cambiar RPM"
        onPress={() => {
          putRPM();
        }}
      />
    );
  };

  //Text Input para peso deseado, maneja la caja de input del usuario
  const 
  textPeso = () => {
    return (
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber1}
        value={number1}
        placeholder="Peso a completar"
        keyboardType="numeric"
      />
    );
  };

  //PUT para peso deseado con el api REST
  const putPeso = () => {
    console.log("PUT Peso deseado");
    fetchWithTimeout("http://192.168.1.103:80/pesoDeseado", {
      method: "PUT",
      timeout: 1000,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ peso: number1 }),
    }).catch(function (err) {
      setEstado("Error");
      console.log(err); // Prints "Error: something went terribly wrong"
    });
  };

  //Boton para mandar PRM Deseado
  const buttonPeso = () => {
    return (
      <Button
        style={styles.button}
        title="Cambiar Peso"
        onPress={() => {
          putPeso();
        }}
      />
    );
  };

  //Estructura general de la pagina, MODIFICAR ESTO PARA ESTRUCTURA
  return (
    <View style={styles.fullApp}>
      <View>
        <Text style={styles.title}>CHOCOLANDES</Text>
      </View>
      <View>
        <View style={styles.labels}>{getRPM()}</View>
        <View style={styles.labels}>{getTemp()}</View>
        <View style={styles.labels}>{getPeso()}</View>
        <View>
          {textRPM()}
          {buttonRPM()}
        </View>
        <View>
          {textPeso()}
          {buttonPeso()}
        </View>
        <View style={styles.estiloEstadoLabel}>
          {getEstado()}
        </View>
      </View>
    </View>
  );
}

//Poner estilos a los textos, MODIFICAR ESTO PARA ESTILO
const styles = StyleSheet.create({
  fullApp: {
    flex: 1,
    backgroundColor: "#FFFEF2",
    padding: 10,
    flexDirection: 'column',
    
  },

  title: {
    fontSize: 50,
    marginTop: '10%',
    textAlign: 'center',
    flexDirection: 'column',
    marginBottom: '3%',
    color: '#5E2C04',

  },

  labels: {
    minWidth: '80%',
    minHeight: '10%',
    marginTop: '1%',
    marginBottom: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'coral',
    borderRadius: 50,
  },

  labelText: {
    fontSize: 40,
    color: 'white',
  },

  input: {
    fontSize: 40,
    minHeight: '10%',
    margin: 12,
    borderWidth: 1,
    backgroundColor: 'aliceblue',
  },

  button: {
    fontSize: 40,
  },

  estiloEstadoTexto:{
    fontSize: 40,
    color: 'white',
  },

  estiloEstadoLabel:{
    minWidth: '80%',
    minHeight: '10%',
    marginTop: '4%',
    marginBottom: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'blue',
    borderRadius: 50,
  }

});

//Para el put pero si no se recibe respuesta se termina la transaccion
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}
