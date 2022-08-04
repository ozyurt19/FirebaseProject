import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
const userCollection = firestore().collection('product');

const ProductList = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [lastDocument, setLastDocument] = useState();
  const [page, setPage] = useState(-1);
  const [size, setSize] = useState(0);

  function updateProduct(doc) {
    console.log('Product updated!');
    userCollection.doc(doc.id).update({
      brand: reverseString(doc._data.brand),
    });
    LoadData();
  }

  function LoadData() {
    console.log('LOAD');
    let query = userCollection.orderBy('price', 'asc'); //.where('color', 'in', ['Casper', 'red']);
    if (lastDocument !== undefined) {
      query = query.startAfter(lastDocument); // fetch data following the last document accessed
    }
    if (size === 0) {
      query.get().then(querySnapshot => {
        setSize(querySnapshot.size / 3);
      });
    }
    if (page === Math.ceil(size)) {
      setPage(0);
    } else {
      setPage(page + 1);
    }

    query
      .limit(3)
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
    LoadData();
  }

  function LoadData() {
    console.log('LOAD');
    let query = userCollection.orderBy('price', 'asc'); //.where('color', 'in', ['Casper', 'red']);
    if (lastDocument !== undefined) {
      query = query.startAfter(lastDocument); // fetch data following the last document accessed
    }
    if (size === 0) {
      query.get().then(querySnapshot => {
        setSize(querySnapshot.size / 3);
      });
    }
    if (page === Math.ceil(size)) {
      setPage(0);
    } else {
      setPage(page + 1);
    }

    query
      .limit(3)
      .get()
      .then(querySnapshot => {
        setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
        MakeUserData(querySnapshot.docs);
        //func();
      });
  }

  function MakeUserData(docs) {
    let templist = []; //[...userData] <- use this instead of [] if you want to save the previous data.
    docs.forEach((doc, i) => {
      console.log(doc._data);
      let temp = (
        <View key={i} style={styles.products}>
          <View>
            <Text style={{ color: doc._data.color.trim() }}>
              {doc._data.brand} {doc._data.name} {doc._data.color}
            </Text>
            <TouchableOpacity
              onPress={() => {
                updateProduct(doc);
              }}>
              <View style={styles.reverseButton} />
            </TouchableOpacity>
          </View>
          <Text>Price: {doc._data.price}</Text>
        </View>
      );
      templist.push(temp);
    });
    setUserData(templist); //replace with the new data
  }
  return (
    <View style={styles.main}>
      {userData}
      <Text>page: {page + 1}</Text>
      <Button
        onPress={() => {
          LoadData();
        }}
        title="Load Next"
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
  products: {
    margin: 10,
  },
  reverseButton: {
    width: '3%',
    aspectRatio: 1,
    backgroundColor: 'black',
    borderRadius: 4,
  },
});
export default ProductList;
