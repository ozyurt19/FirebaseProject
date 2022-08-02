import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, TextInput } from 'react-native';
/*https://invertase.io/blog/getting-started-with-cloud-firestore-on-react-native */
import firestore from '@react-native-firebase/firestore';
const userCollection = firestore().collection('product');

const App = () => {
  const [lastDocument, setLastDocument] = useState();
  const [userData, setUserData] = useState([]);
  const [todo, setTodo] = useState('Enter brand, name, color, price!');
  function reverseString(str) {
    var splitString = str.split('');
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join('');
    return joinArray;
  }
  function aaa(doc) {
    userCollection.doc(doc.id).update({
      brand: reverseString(doc._data.brand),
    });
    userCollection.get().then(querySnapshot => {
      setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
      MakeUserData(querySnapshot.docs);
    });
  }

  function MakeUserData(docs) {
    let templist = []; //[...userData] <- use this instead of [] if you want to save the previous data.
    docs.forEach((doc, i) => {
      //console.log(doc._data);
      let temp = (
        <View key={i} style={{ margin: 10 }}>
          <Button
            title="Reverse brand name"
            onPress={() => {
              aaa(doc);
            }}
          />
          <Text>
            {doc._data.brand} {doc._data.name}
          </Text>
          <Text>Price: {doc._data.price}</Text>
        </View>
      );
      templist.push(temp);
    });
    setUserData(templist); //replace with the new data
  }

  function func() {
    firestore()
      .collection('product')
      .get()
      .then(querySnapshot => {
        console.log('Total products: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          console.log(
            'product ID: ',
            documentSnapshot.id,
            documentSnapshot.data(),
          );
        });
      });
  }
  function LoadData() {
    console.log('LOAD');
    let query = userCollection.orderBy('color', 'desc'); //.where('color', 'in', ['Casper', 'red']);
    if (lastDocument !== undefined) {
      query = query.startAfter(lastDocument); // fetch data following the last document accessed
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

  return (
    <View style={styles.main}>
      {userData}
      <Button
        onPress={() => {
          LoadData();
        }}
        title="Load Next"
      />
      <Text>deneme</Text>
      <TextInput label={'New Todo'} onChangeText={setTodo} value={todo} />
      <Button
        onPress={() => {
          userCollection.add({
            brand: [...todo.split(',')][0],
            name: [...todo.split(',')][1],
            color: [...todo.split(',')][2],
            price: [...todo.split(',')][3],
          });
        }}
        title="add Todo"
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

export default App;
