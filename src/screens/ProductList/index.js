import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
const userCollection = firestore().collection('product');
import DropDownPicker from 'react-native-dropdown-picker';
//import LoadData from '../../../data/product';

const ProductList = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [userData2, setUserData2] = useState('');
  const [lastDocument, setLastDocument] = useState();
  const [productNum, setProductNum] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('asc');
  const [items, setItems] = useState([
    { label: 'Increasing order of price', value: 'asc' },
    { label: 'Decreasing order of price', value: 'desc' },
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      LoadData();
      //console.log('feed is focused');
    });
    LoadData();
    return unsubscribe;
  }, [LoadData, navigation, value]);

  function reverseString(str) {
    var splitString = str.split('');
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join('');
    return joinArray;
  }

  const reverseProductName = useCallback(
    doc => {
      userCollection.doc(doc.id).update({
        brand: reverseString(doc._data.brand),
      });
      LoadData();
    },
    [LoadData],
  );

  const deleteProduct = useCallback(
    doc => {
      userCollection
        .doc(doc.id)
        .delete()
        .then(() => {
          // eslint-disable-next-line no-alert
          alert('Product deleted!');
        });
      LoadData();
    },
    [LoadData],
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);

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

  const MakeUserData = useCallback(
    docs => {
      let templist = []; //[...userData] <- use this instead of [] if you want to save the previous data.
      docs.forEach((doc, i) => {
        //console.log(doc._data);
        let temp = (
          <View key={i} style={styles.product}>
            <TouchableOpacity
              onLongPress={() => {
                reverseProductName(doc);
              }}
              onPress={() => {
                setProductNum(i);
                setModal2Visible(true);
                setUserData2(doc._data.description);
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
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => {
                setProductNum(i);
                setModalVisible(true);
              }}>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                ...
              </Text>
            </Pressable>
            <Text>{doc._data.price} TRY</Text>
          </View>
        );
        templist.push(temp);
      });
      setUserData(templist); //replace with the new data
    },
    [reverseProductName],
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal2Visible}
        onRequestClose={() => {
          setModal2Visible(!modal2Visible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable style={[styles.button]}>
              <Text style={styles.descriptionStyle}>
                Description: {userData2}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModal2Visible(!modal2Visible);
              }}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                userCollection
                  .orderBy('price', value)
                  .get()
                  .then(querySnapshot => {
                    deleteProduct(querySnapshot.docs[productNum]);
                  });
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Delete Product</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    margin: 3,
    width: '48%',
    backgroundColor: '#E1E8ED',
    borderRadius: 2,
  },
  products: {
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    marginTop: 570,
    backgroundColor: '#E1E8ED',
    borderRadius: 20,
    padding: 20,
    alignItems: 'flex-end',
    shadowColor: '#14171A',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 3,
    padding: 2,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#14171A',
    borderRadius: 3,
    padding: 2,
    width: '16%',
    alignSelf: 'flex-end',
  },
  buttonClose: {
    backgroundColor: '#657786',
    margin: 15,
  },
  textStyle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  descriptionStyle: {
    color: 'black',
    fontSize: 20,
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
