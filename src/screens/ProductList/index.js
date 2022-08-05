import React, { useState } from 'react'; //dropdown
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
const userCollection = firestore().collection('product');
import DropDownPicker from 'react-native-dropdown-picker';

const ProductList = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [lastDocument, setLastDocument] = useState();

  function LoadData(order = 'asc') {
    let query = userCollection.orderBy('price', order); //.where('color', 'in', ['Casper', 'red']);
    if (lastDocument !== undefined) {
      query = query.startAfter(lastDocument); // fetch data following the last document accessed
    }
    query
      //.limit(3)
      .get()
      .then(querySnapshot => {
        setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
        MakeUserData(querySnapshot.docs);
        //func();
      });
  }

  function reverseString(str) {
    var splitString = str.split('');
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join('');
    return joinArray;
  }

  function updateProduct(doc) {
    console.log('Product updated!');
    userCollection.doc(doc.id).update({
      brand: reverseString(doc._data.brand),
    });
    LoadData(value);
  }

  function MakeUserData(docs) {
    let templist = []; //[...userData] <- use this instead of [] if you want to save the previous data.
    docs.forEach((doc, i) => {
      console.log(doc._data);
      let temp = (
        <View key={i} style={styles.product}>
          <TouchableOpacity
            onPress={() => {
              updateProduct(doc);
            }}>
            <Image
              style={styles.imgStyle}
              source={{
                uri: doc._data.imgUrl,
              }}
            />
            <Text>
              {doc._data.brand} {doc._data.name} {doc._data.color}
            </Text>
          </TouchableOpacity>
          <Text>{doc._data.price} TRY</Text>
        </View>
      );
      templist.push(temp);
    });
    setUserData(templist); //replace with the new data
  }

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('asc');
  const [items, setItems] = useState([
    { label: 'Increasing order', value: 'asc' },
    { label: 'Decreasing order', value: 'desc' },
  ]);

  return (
    <View style={styles.main}>
      <DropDownPicker
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ backgroundColor: '#E1E8ED' }}
        containerStyle={styles.dropDown}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
      <ScrollView>
        <View style={styles.products}>{userData}</View>
      </ScrollView>
      <View>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => {
            LoadData(value);
          }}>
          <Text style={styles.touchableOpacityText}>Load Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 50,
    backgroundColor: '#F5F8FA',
  },
  product: {
    padding: 8,
    height: '27%',
    margin: 3,
    width: '46%',
    backgroundColor: '#E1E8ED',
    borderRadius: 10,
  },
  products: {
    height: '70%',
    flexDirection: 'row',

    flexWrap: 'wrap',
  },
  touchableOpacity: {
    width: '45%',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#657786',
    marginTop: 15,
  },
  touchableOpacityText: {
    color: 'white',
    fontSize: 17,
    padding: 15,
  },
  imgStyle: {
    width: '80%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  dropDown: {
    width: '48%',
    alignSelf: 'flex-end',
    paddingBottom: 20,
  },
});
export default ProductList;
//style={{ color: doc._data.color.trim() }}
