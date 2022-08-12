import React, { useContext, useEffect, useState } from 'react';
//import { getItem } from '../../storage/mmkv';
import { View, Text, Pressable, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { reverseProductName, LoadData } from '../../utils/productUtil';
import { AppContext } from '../../../App';
import { UserDataCart } from '../../components/userDataCart';
import styles from './styles';

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
          <UserDataCart
            key={i}
            doc={doc}
            i={i}
            reverseProductName={reverseProductName}
            setModal2Visible={setModal2Visible}
            setUserData2={setUserData2}
            setDeleteNum={setDeleteNum}
            setModalVisible={setModalVisible}
            productsInCart={productsInCart}
          />
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
