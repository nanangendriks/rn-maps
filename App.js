import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';

import MapView, { ProviderPropType, Marker, AnimatedRegion } from 'react-native-maps';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = -7.304164;
const LONGITUDE = 112.661136;
const LATITUDE_DELTA = 0.0922; //default
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const markers = [
  {
    id: 0,
    coordinate: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    },
    title: 'Tempat 1',
    description: 'Ini tempat 1'
  }
];

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
      }),
      long: 112.661136
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {
            markers.map((item, idx) => {
              return (
                <MapView.Marker key={idx}
                  coordinate={item.coordinate}
                  title={item.title}
                  description={item.description}
                />
              )
            })
          }
        </MapView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default Home;