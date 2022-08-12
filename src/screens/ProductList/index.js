/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  deleteProduct,
  reverseProductName,
  LoadData,
} from '../../utils/productUtil';
import { AppContext } from '../../../App';

const ProductList = ({ navigation }) => {
  const { productNum, setProductNum } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [lastDocument, setLastDocument] = useState();
  const [productToDelete, setProductToDelete] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userData2, setUserData2] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('asc');
  const [items, setItems] = useState([
    { label: 'Increasing order of price', value: 'asc' },
    { label: 'Decreasing order of price', value: 'desc' },
  ]);

  const load = async () => {
    const { last, docs } = await LoadData(value, lastDocument);
    setLastDocument(last);
    MakeUserData(docs);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const { last, docs } = await LoadData(value, lastDocument);
      setLastDocument(last);
      MakeUserData(docs);
    });
    load();
    return unsubscribe;
  }, [lastDocument, navigation, value, userData]);

  const MakeUserData = docs => {
    let templist = []; //[...userData] <- use this instead of [] if you want to save the previous data.
    docs.forEach((doc, i) => {
      if (!doc) {
        return null;
      }
      let temp = (
        <View key={i} style={styles.product}>
          <TouchableOpacity
            onLongPress={() => reverseProductName(doc)}
            onPress={() => {
              setProductToDelete(i);
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
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            <Pressable
              style={styles.buttonCart}
              onPress={() => {
                let tmp = [...productNum].concat([i]);
                setProductNum(tmp);
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Add to Cart
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => {
                setProductToDelete(i);
                setModalVisible(true);
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                ...
              </Text>
            </Pressable>
          </View>
          <Text>{doc._data.price} TRY</Text>
        </View>
      );
      templist.push(temp);
    });
    setUserData(templist); //replace with the new data
  };

  const onPressDeleteProduct = async () => {
    await deleteProduct(productToDelete, value);
    const { last, docs } = await LoadData(value, lastDocument);
    setLastDocument(last);
    MakeUserData(docs);

    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.main}>
      <DropDownPicker
        style={{ backgroundColor: '#E1E8ED', borderWidth: 0 }}
        containerStyle={styles.dropDown}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        dropDownContainerStyle={{ borderWidth: 0 }}
      />
      <ScrollView>
        <View style={styles.products}>{userData}</View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Cart');
        }}>
        <View style={{ alignSelf: 'center' }}>
          <Text>Go to Cart{productNum.length}</Text>
        </View>
      </TouchableOpacity>

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
              onPress={onPressDeleteProduct}>
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
  buttonCart: {
    width: '80%',
    backgroundColor: '#14171A',
    borderRadius: 3,
    margin: 2,
    alignSelf: 'flex-end',
    elevation: 2,
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
