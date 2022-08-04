import React, { useState } from 'react';
import { View, Button, StyleSheet, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
const userCollection = firestore().collection('product');

const AddProduct = props => {
  const [todo, setTodo] = useState('determine brand, name, color, price!');
  return (
    <View style={styles.main}>
      <TextInput label={'New Todo'} onChangeText={setTodo} value={todo} />
      <Button
        onPress={() => {
          userCollection.add({
            brand: [...todo.split(',')][0],
            name: [...todo.split(',')][1],
            color: [...todo.split(',')][2],
            price: parseInt([...todo.split(',')][3], 10),
          });
        }}
        title="Add a Product"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: 100,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
export default AddProduct;
