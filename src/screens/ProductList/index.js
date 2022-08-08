import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
const userCollection = firestore().collection('product');
import DropDownPicker from 'react-native-dropdown-picker';

const ProductList = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [lastDocument, setLastDocument] = useState();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('asc');
  const [items, setItems] = useState([
    { label: 'Increasing order of price', value: 'asc' },
    { label: 'Decreasing order of price', value: 'desc' },
  ]);

  useEffect(() => {
    LoadData();
  }, [LoadData, value]);

  function reverseString(str) {
    var splitString = str.split('');
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join('');
    return joinArray;
  }

  const LoadData = useCallback(() => {
    let query = userCollection.orderBy('price', value); //.where('color', 'in', ['Casper', 'red']);
    if (lastDocument !== undefined) {
      query = query.startAfter(lastDocument); // fetch data following the last document accessed
    }
    query
      //.limit(3)
      .get()
      .then(querySnapshot => {
        setLastDocument(querySnapshot.docs[querySnapshot.docs.length]);
        MakeUserData(querySnapshot.docs);
        //func();
      });
  }, [MakeUserData, lastDocument, value]);

  const updateProduct = useCallback(
    doc => {
      userCollection.doc(doc.id).update({
        brand: reverseString(doc._data.brand),
      });
      LoadData();
    },
    [LoadData],
  );

  const MakeUserData = useCallback(
    docs => {
      let templist = []; //[...userData] <- use this instead of [] if you want to save the previous data.
      docs.forEach((doc, i) => {
        //console.log(doc._data);
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
    },
    [updateProduct],
  );

  return (
    <View style={styles.main}>
      <DropDownPicker
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ backgroundColor: '#E1E8ED', borderWidth: 0 }}
        containerStyle={styles.dropDown}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        // eslint-disable-next-line react-native/no-inline-styles
        dropDownContainerStyle={{ borderWidth: 0 }}
      />
      <ScrollView>
        <View style={styles.products}>{userData}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 70,
    backgroundColor: '#F5F8FA',
  },
  product: {
    paddingHorizontal: 8,
    paddingBottom: 5,
    height: '27%',
    margin: 3,
    width: '48%',
    backgroundColor: '#E1E8ED',
    borderRadius: 2,
  },
  products: {
    height: '61%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imgStyle: {
    width: '110%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  dropDown: {
    width: '60%',
    alignSelf: 'flex-end',
    paddingBottom: 10,
    borderWidth: 0,
  },
});
export default ProductList;
//style={{ color: doc._data.color.trim() }}
/*
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
  */
