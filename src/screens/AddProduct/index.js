import React, { useState } from 'react';
import { View, Button, StyleSheet, TextInput, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
const userCollection = firestore().collection('product');
const labelsAndColors = firestore().collection('labels-and-colors');
import { useForm, Controller } from 'react-hook-form';
import DropDownPicker from 'react-native-dropdown-picker';

const AddProduct = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  labelsAndColors.get().then(querySnapshot => {
    const tmp = [];
    querySnapshot.forEach(item => {
      tmp.push(item._data);
    });
    setItems(tmp);
  });

  const {
    //register,
    //setValue,
    handleSubmit,
    control,
    reset,
    //formState: { errors },
  } = useForm();

  const onSubmit = data => {
    //console.log(data);
    userCollection.add({
      brand: data.brand,
      name: data.name,
      color: data.color,
      price: parseInt(data.price, 10),
      imgUrl: data.imgUrl,
    });
    // eslint-disable-next-line no-alert
    alert('Product has been added.');
    reset({
      brand: '',
      name: '',
      color: 'Select an item',
      price: '',
      imgUrl: '',
    });
  };
  return (
    <View style={styles.main}>
      <Text style={styles.label}>Brand</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="eg. 'Apple'"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={valuea => onChange(valuea)}
            value={value}
          />
        )}
        name="brand"
        rules={{ required: true }}
      />
      <Text style={styles.label}>Name of your Product</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="eg. 'iPhone'"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={valuea => onChange(valuea)}
            value={value}
          />
        )}
        name="name"
        rules={{ required: true }}
      />
      <Text style={styles.label}>Color</Text>
      <Controller
        control={control}
        render={({ field }) => (
          <DropDownPicker
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ backgroundColor: '#E1E8ED', borderWidth: 0 }}
            containerStyle={styles.dropDown}
            open={open}
            value={field.value}
            items={items}
            setOpen={setOpen}
            setValue={callback => field.onChange(callback())}
            setItems={setItems}
            // eslint-disable-next-line react-native/no-inline-styles
            dropDownContainerStyle={{ borderWidth: 0 }}
          />
        )}
        name="color"
        rules={{ required: true }}
      />
      <Text style={styles.label}>Price</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            textContentType="password"
            placeholder="price in TRY"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={valuea => onChange(valuea)}
            value={value}
          />
        )}
        name="price"
        rules={{ required: true }}
      />
      <Text style={styles.label}>Image</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            textContentType="URL"
            placeholder="enter a image url here"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={valuea => onChange(valuea)}
            value={value}
          />
        )}
        name="imgUrl"
        rules={{ required: true }}
      />

      <View style={styles.button}>
        <Button
          style={styles.buttonInner}
          color
          title="Reset"
          onPress={() => {
            reset({
              brand: '',
              name: '',
              color: 'Select an item',
              price: '',
              imgUrl: '',
            });
          }}
        />
      </View>

      <View style={styles.button}>
        <Button
          style={styles.buttonInner}
          color
          title="Add Product"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 24,
  },
  label: {
    color: 'black',
    margin: 20,
    marginLeft: 0,
  },
  button: {
    marginTop: 40,
    color: 'white',
    height: 40,
    backgroundColor: '#AAB8C2',
    borderRadius: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#0e101c',
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'none',
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
});
export default AddProduct;
/*
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
*/
