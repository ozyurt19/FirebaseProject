import * as React from 'react'; //functionları ve firebase olayin data kisminda tutmak, modalin disina basinca kapanma
import { NavigationContainer } from '@react-navigation/native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddProduct from './src/screens/AddProduct';
import ProductList from './src/screens/ProductList';
import Cart from './src/screens/Cart';
import { createDrawerNavigator } from '@react-navigation/drawer';

export const AppContext = React.createContext();
const { Screen, Navigator } = createDrawerNavigator();

const App = () => {
  const [productNum, setProductNum] = React.useState([]);
  return (
    <NavigationContainer>
      <AppContext.Provider value={{ productNum, setProductNum }}>
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
      </AppContext.Provider>
    </NavigationContainer>
  );
};

export default App;
