import * as React from 'react'; //functionları ve firebase olayin data kisminda tutmak, suna gore sirala kismi, tasarimi guzellestirmek
/*https://invertase.io/blog/getting-started-with-cloud-firestore-on-react-native */
import { NavigationContainer } from '@react-navigation/native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddProduct from './src/screens/AddProduct';
import ProductList from './src/screens/ProductList';
import { createDrawerNavigator } from '@react-navigation/drawer';

const { Screen, Navigator } = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Navigator useLegacyImplementation={true}>
        <Screen name="ProductList" component={ProductList} />
        <Screen name="AddProduct" component={AddProduct} />
      </Navigator>
    </NavigationContainer>
  );
};

export default App;
