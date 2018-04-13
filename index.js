import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Navigator from './pages/';

class App extends Component {
  render() {
    return <Navigator />
  }
}

AppRegistry.registerComponent('testMaps', () => App);
