/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TouchableOpacity, Text, Image, Pressable } from 'react-native';
import pt from 'prop-types';
import styles from '../../screens/Cart/styles';

const UserDataCart = props => {
  const {
    doc,
    i,
    reverseProductName,
    setModal2Visible,
    setUserData2,
    setDeleteNum,
    setModalVisible,
    productsInCart,
  } = props;
  return (
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
};

UserDataCart.propTypes = {
  doc: pt.object,
  i: pt.number,
  reverseProductName: pt.func,
  setModal2Visible: pt.func,
  setUserData2: pt.func,
  setDeleteNum: pt.func,
  setModalVisible: pt.func,
  productsInCart: pt.array,
};
UserDataCart.defaultProps = {
  doc: {},
  i: 0,
  reverseProductName: () => {},
  setModal2Visible: () => {},
  setUserData2: () => {},
  setDeleteNum: () => {},
  setModalVisible: () => {},
  productsInCart: [],
};

export { UserDataCart };
