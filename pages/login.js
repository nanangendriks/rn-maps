import React, { Component } from 'react';
import { View, TextInput, Button, ToastAndroid, AsyncStorage, Geolocation, ActivityIndicator, Text } from 'react-native';
import { NavigationActions } from 'react-navigation'

export default class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: null,
      password: null,
      lat: null,
      longi: null,
      loading: true,
      position: []
    }
  }

  clearNavigation(screen) {
    this.props.navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: screen })
        ]
      })
    )
  }

  async checkUserLogin() {
    var check = await AsyncStorage.getItem('DataLogin')
    if (check != null) {
      this.clearNavigation('HomeScreen')
    } else {
      this.getPosition()
      this.setState({
        loading: false
      })
    }
  }

  getPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: position.coords.latitude,
        longi: position.coords.longitude,
        loading: false
      })
      console.log(position)
    })
  }

  componentDidMount() {
    this.checkUserLogin()
  }

  SubmitLogin() {
    const { username, password, lat, longi } = this.state
    if (username != null && password != null) {
      fetch('https://www.25clouds.com/apps/newLogin', {
        method: 'POST',
        header: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          name: username,
          pass: password,
          lat: lat,
          longi: longi,
        })
      })
        .then(respone => respone.json())
        .then(res => {
          console.log(res)
          if (res.status == '200') {
            this.clearNavigation('HomeScreen')
            var object = {
              username: this.state.username,
              token: res.token,
              iduser: res.id,
            }
            console.log("data login " + JSON.stringify(object))
            AsyncStorage.setItem('DataLogin', JSON.stringify(object))
          } else {
            ToastAndroid.show('Login gagal', ToastAndroid.SHORT)
          }
        })
    } else {
      ToastAndroid.show('Inputan harus dilengkapi', ToastAndroid.SHORT)
    }
  }
  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <View style={{ padding: 15 }} >
        <TextInput
          placeholder="username"
          onChangeText={(username) => this.setState({ username })}
        />
        <TextInput
          placeholder="password"
          onChangeText={(password) => this.setState({ password })}
          secureTextEntry={true}
        />
        <Button
          title="Login"
          onPress={() => this.SubmitLogin()}
        />
        <Text>
          latitude : {this.state.lat} Longitude : {this.state.longi}
        </Text>
      </View>
    );
  }
}