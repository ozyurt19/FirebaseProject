/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TouchableOpacity, Text, Image, Pressable } from 'react-native';
import styles from '../../screens/ProductList/styles';

const UserDataList = props => {
  const {
    doc,
    i,
    reverseProductName,
    setModal2Visible,
    setUserData2,
    setProductToDelete,
    setModalVisible,
    setProductNum,
    productNum,
  } = props;
  return (
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
};

export { UserDataList };
