import React, { useContext, useEffect, useState } from 'react';
//import { getItem } from '../../storage/mmkv';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Pressable,
  Modal,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { reverseProductName, LoadData } from '../../utils/productUtil';
//import getProductNum from '../ProductList';
import { AppContext } from '../../../App';

const Cart = ({ navigation }) => {
  const { productNum, setProductNum } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [lastDocument, setLastDocument] = useState();
  const [userData, setUserData] = useState([]);
  const [deleteNum, setDeleteNum] = useState(-1);
  const [userData2, setUserData2] = useState('');
  const [value] = useState('asc');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, userData]);

  const MakeUserData = docs => {
    let templist = []; //[...userData] <- use this instead of [] if you want to save the previous data.
    docs.forEach((doc, i) => {
      if (!doc) {
        return null;
      }
      const productsInCart = productNum?.filter(element => element === i);
      if (productsInCart.length > 0) {
        //getproductnum productlist pasgeden bir array alsin
        let temp = (
          <View key={i} style={styles.product}>
            <TouchableOpacity
              onLongPress={() => reverseProductName(doc)}
              onPress={() => {
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
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                flexDirection: 'column',
                width: '100%',
              }}>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  setDeleteNum(i);
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
                  Remove from Cart
                </Text>
              </Pressable>
            </View>
            <Text>
              {doc._data.price} TRY x {productsInCart.length} ={'\n'}
              {doc._data.price * productsInCart.length} TRY
            </Text>
          </View>
        );
        templist.push(temp);
      }
    });
    setUserData(templist); //replace with the new data
  };

  const discardFromCart = async i => {
    let tmp = [...productNum]?.filter(element => element !== deleteNum);
    setProductNum(tmp);
    const { last, docs } = await LoadData(value, lastDocument);
    setLastDocument(last);
    MakeUserData(docs);
    setModalVisible(!modalVisible);
  };
  return (
    <View style={styles.main}>
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
              onPress={() => discardFromCart(deleteNum)}>
              <Text style={styles.textStyle}>Discard Product from Cart?</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginTop: 70,
    backgroundColor: '#E1E8ED',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
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
    width: '50%',
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
export default Cart;
/*
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const newData = JSON.parse(getItem('keyy'));
      console.log(typeof newData);
      //setData(newData);
    });
    return unsubscribe;
  }, [navigation]);
*/
