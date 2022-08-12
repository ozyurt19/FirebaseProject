/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Modal, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  deleteProduct,
  reverseProductName,
  LoadData,
} from '../../utils/productUtil';
import { AppContext } from '../../../App';
import { UserDataList } from '../../components/userDataList';
import styles from './styles';

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
        <UserDataList
          key={i}
          doc={doc}
          i={i}
          reverseProductName={reverseProductName}
          setModal2Visible={setModal2Visible}
          setUserData2={setUserData2}
          setProductToDelete={setProductToDelete}
          setModalVisible={setModalVisible}
          setProductNum={setProductNum}
          productNum={productNum}
        />
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
