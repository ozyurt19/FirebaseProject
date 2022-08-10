import firestore from '@react-native-firebase/firestore';

import { reverseString } from './stringUtils';

const userCollection = firestore().collection('product');

const LoadData = async (val, lastDocument) => {
  let query = userCollection.orderBy('price', val); //.where('color', 'in', ['Casper', 'red']);

  if (lastDocument !== undefined) {
    query = query.startAfter(lastDocument); // fetch data following the last document accessed
  }

  const querySnapshot = await query.get();
  return {
    lastDocument: querySnapshot.docs[querySnapshot.docs.length],
    docs: querySnapshot.docs,
  };

  // .then(querySnapshot => {
  //  setLastDocument();
  //  MakeUserData();
  // });
};

const deleteProduct = async (num, val) => {
  const querySnapshot = await userCollection.orderBy('price', val).get();
  const docum = querySnapshot.docs[num];

  await userCollection.doc(docum.id).delete();

  // eslint-disable-next-line no-alert
  alert('Product deleted!');
};

const reverseProductName = doc => {
  userCollection.doc(doc.id).update({
    brand: reverseString(doc._data.brand),
  });
  //loaddata cagiriyoduk render ediyodu
};

export { deleteProduct, reverseProductName, LoadData };
