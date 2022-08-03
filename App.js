import React, { useState, useEffect } from 'react'; //sayfalara bolmek, drawer navigation, functionları ve firebase olayin data kisminda tutmak
import { Text, View, Button, StyleSheet, TextInput } from 'react-native';
/*https://invertase.io/blog/getting-started-with-cloud-firestore-on-react-native */
import firestore from '@react-native-firebase/firestore';
//import auth from '@react-native-firebase/auth';
const userCollection = firestore().collection('product');

const App = () => {
  const [lastDocument, setLastDocument] = useState();
  const [userData, setUserData] = useState([]);
  const [size, setSize] = useState(0);
  const [page, setPage] = useState(-1);
  const [todo, setTodo] = useState('Enter brand, name, color, price!');
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

  function MakeUserData(docs) {
    console.log('makeUserData called!');
    let templist = []; //[...userData] <- use this instead of [] if you want to save the previous data.
    docs.forEach((doc, i) => {
      //console.log(doc._data);
      let temp = (
        <View key={i} style={{ margin: 10 }}>
          <Button
            title="Reverse brand name"
            onPress={() => {
              updateProduct(doc);
            }}
          />
          <Text style={{ color: doc._data.color.trim() }}>
            {doc._data.brand} {doc._data.name} {doc._data.color}
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
