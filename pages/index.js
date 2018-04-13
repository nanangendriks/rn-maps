import { StackNavigator } from 'react-navigation'

import Home from './home'
import Login from './login'

export default Navaigator =  StackNavigator({
  HomeScreen : { screen: Home },
  LoginScreen: { screen: Login }
},{
  initialRouteName: 'LoginScreen'
})