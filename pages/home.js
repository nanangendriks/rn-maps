import React, { Component } from 'react';
import { View, StyleSheet, Geolocation, TouchableOpacity, Dimensions, AsyncStorage, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { NavigationActions } from 'react-navigation'

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      latitude: 0,
      longitude: 0,
      tanda: [],
      id: null,
      result: null
    }
  }

  clearNavigation(screen) {
    this.removeData()    
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
    let check = await AsyncStorage.getItem('DataLogin')
    let parsed = JSON.parse(check)
    if (check != null) {
      this.setState({
        id: parsed.iduser
      })
    }
  }

  getPosition() {
    navigator.geolocation.watchPosition(
      posisi => {
        this.setState({
          latitude: posisi.coords.latitude,
          longitude: posisi.coords.longitude
        })
      },
      (error) => console.log(error),
      { enableHighAccuracy: true }
    )
  }

  async fetchData() {
    fetch('https://www.25clouds.com/apps/getUser')
      .then(respone => respone.json())
      .then(res => {
        this.setState({
          tanda: res.data
        })
      })
  }

  postData() {
    const { longitude, latitude, id } = this.state
    fetch('https://www.25clouds.com/apps/updatePosition', {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        id: id ,
        lat: latitude,
        longi: longitude,
      })
    })
      .then(respone => respone.json())
      .then(res => {
        console.log(res)
      })
  }
  componentDidMount() {
    this.getPosition()
    this.checkUserLogin()
    this.timer = setInterval(() => this.postData(), 5000)
    this.timer2 = setInterval(() => this.fetchData(), 5000)
  }

  removeData = async () => {
    await AsyncStorage.removeItem('DataLogin')
  }

  logOut() {
    Alert.alert(
      'App',
      'Logout?',
      [
        { text: 'Cancel' },
        { text: 'YES', onPress: () => this.clearNavigation('LoginScreen') },
      ],
      { cancelable: false }
    )
    console.log('User Logout')
  }

  render() {
    const newtanda = this.state.tanda
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <View>
            {
              this.state.tanda.map((item, idx) => {
                return (
                  <MapView.Marker
                    key={idx}
                    coordinate={item.coordinate}
                    title={item.title}
                  />
                )
              })
            }
          </View>
        </MapView>
        <View style={{ padding: 10, backgroundColor: '#fafafa' }} >
          <Text>
            Latitude : {this.state.latitude} Longitude : {this.state.longitude} {"\n"}
            User id : {this.state.id}
          </Text>
          <TouchableOpacity
            onPress={() => this.logOut()}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}