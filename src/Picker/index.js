import React from "react";

import { Picker } from "@react-native-picker/picker";

export default function PickerItem({ moedas, moedasSelecionada, onChange }) {
  let moedasItem = moedas.map((item, index) => {
    return <Picker.Item value={item.id} key={index} label={item.id} />;
  });

  return (
    <Picker
      selectedValue={moedasSelecionada}
      onValueChange={(valor) => onChange(valor)}
    >
      {moedasItem}
    </Picker>
  );
}
