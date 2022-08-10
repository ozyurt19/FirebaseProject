import React, { useEffect, useState } from 'react';
//import { getItem } from '../../storage/mmkv';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const Cart = ({ navigation }) => {
  //const [data, setData] = useState([]);
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
  return (
    <View style={styles.main}>
      <ScrollView>
        <View style={styles.products}>{}</View>
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
export default Cart;

/*<DropDownPicker
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
      /> */
