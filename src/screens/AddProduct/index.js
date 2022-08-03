import React from 'react';
import { View, Button, StyleSheet, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
const userCollection = firestore().collection('product');

const AddProduct = props => {
  return (
    <View style={styles.main}>
      <TextInput
        label={'New Todo'}
        onChangeText={props.route.params.setTodo}
        value={props.route.params.todo}
      />
      <Button
        onPress={() => {
          userCollection.add({
            brand: [...props.route.params.todo.split(',')][0],
            name: [...props.route.params.todo.split(',')][1],
            color: [...props.route.params.todo.split(',')][2],
            price: parseInt([...props.route.params.todo.split(',')][3], 10),
          });
        }}
        title="Add a Product"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
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
