import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";

import { api } from "./src/Services/api";

import { useState, useEffect } from "react";
import PickerItem from "./src/Picker";

export default function App() {
  const [load, setLoad] = useState(true);

  const [moedas, setMoedas] = useState([]);

  const [moedasSelecionada, setMoedaSelecionada] = useState(0);

  const [moedaBValor, setMoedaBValor] = useState(0);
  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0);

  useEffect(() => {
    async function carregandoMoedas() {
      // Busca os resultados da api, que sao objetos
      const response = await api.get("all");

      // Cria um array para armazenar os objetos
      let arrayMoedas = [];

      // Object.keys -> acessa cada chave (cada moeda) da api
      Object.keys(response.data).map((id) => {
        arrayMoedas.push({
          id: id,
          label: id,
          value: id,
        });
      });

      // Armazena dentro de modeas
      setMoedas(arrayMoedas);

      setMoedaSelecionada(arrayMoedas[0].id);

      // Remove loading da tela
      setLoad(false);
    }

    carregandoMoedas();
  }, []);

  async function converter() {
    if (moedaBValor === 0 || moedaBValor === "" || moedasSelecionada === null) {
      return;
    }

    const response = await api.get(`/all/${moedasSelecionada}-BRL`);

    // Acessando o valor atual da moeda selecionada
    // console.log(response.data[moedasSelecionada].ask)

    let valorMoedaAtual = response.data[moedasSelecionada].ask;
    let valorConvertido = valorMoedaAtual * moedaBValor;

    setValorConvertido(
      `${valorConvertido.toLocaleString("pt-BR", {
        style: "currency", // currency quer dizer que é moeda
        currency: "BRL", // tipo da moeda
      })}`
    );
    setValorMoeda(moedaBValor);
    // console.log(valorConvertido.toFixed(2))

    Keyboard.dismiss(); // dismiss -> Apenas fecha o teclado
  }

  // se load = true
  if (load) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#101215",
        }}
      >
        <ActivityIndicator color="red" size={64} />
      </View>
    );
  }

  return (
    <View style={st.container}>
      <View style={st.areaTitle}>
        <Text style={st.titleApp}>Conversor de Moedas - BRL</Text>
      </View>

      <View style={st.areaModea}>
        <Text style={st.titulo}>Selecione a moeda</Text>

        <PickerItem
          moedas={moedas}
          moedasSelecionada={moedasSelecionada}
          onChange={(moedaNova) => {
            setMoedaSelecionada(moedaNova);
          }}
        />
      </View>

      <View style={st.areaValor}>
        <Text style={st.titulo}>Digite um valor (R$)</Text>

        <TextInput
          placeholder="Ex: 245"
          style={st.input}
          keyboardType="numeric"
          value={moedaBValor}
          onChangeText={(valor) => setMoedaBValor(valor)}
        />
      </View>

      <TouchableOpacity style={st.btnArea} onPress={converter}>
        <Text style={st.btnText}>Converter</Text>
      </TouchableOpacity>

      {valorConvertido != 0 && (
        <View style={st.areaResultado}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {valorMoeda} {moedasSelecionada}
          </Text>

          <Text
            style={{
              fontSize: 18,
              marginTop: 10,
              marginBottom: 10,
              fontWeight: 500,
            }}
          >
            Corresponde a
          </Text>

          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {valorConvertido}
          </Text>
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101215",
    alignItems: "center",
    paddingTop: 100,
  },
  areaTitle: {
    width: "80%",
    alignItems: "center",
  },
  titleApp: {
    color: "#fafafa",
    fontSize: 38,
    fontWeight: 500,
    marginBottom: 20,
  },
  areaModea: {
    backgroundColor: "#fafafa",
    width: "85%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    marginBottom: 1,
  },
  titulo: {
    fontSize: 17,
    fontWeight: "bold",
  },
  areaValor: {
    backgroundColor: "#fafafa",
    width: "85%",
    padding: 10,
    marginBottom: 2,
  },
  input: {
    fontSize: 18,
    padding: 8,
  },
  btnArea: {
    width: "85%",
    backgroundColor: "#10b981",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  areaResultado: {
    backgroundColor: "#fafafa",
    width: "85%",
    marginTop: 30,
    alignItems: "center",
    borderRadius: 10,
    padding: 14,
  },
});
