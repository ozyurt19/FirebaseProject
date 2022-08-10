import * as React from 'react'; //functionları ve firebase olayin data kisminda tutmak, modalin disina basinca kapanma
import { NavigationContainer } from '@react-navigation/native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddProduct from './src/screens/AddProduct';
import ProductList from './src/screens/ProductList';
import Cart from './src/screens/Cart';
import { createDrawerNavigator } from '@react-navigation/drawer';

const { Screen, Navigator } = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{
          drawerActiveBackgroundColor: '#AAB8C2',
          drawerActiveTintColor: 'white',
          drawerInactiveTintColor: '#657786',
        }}
        useLegacyImplementation={true}>
        <Screen name="ProductList" component={ProductList} />
        <Screen name="AddProduct" component={AddProduct} />
        <Screen name="Cart" component={Cart} />
      </Navigator>
    </NavigationContainer>
  );
};

export default App;
