import { MapView } from 'expo'
import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import firebase from './firebaseconfig'

export default class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            markers: [{
                title: 'Send your elder to hospital!',
                coordinates: {
                    latitude: 37.78825,
                    longitude: -122.4324,
                },
            },]
        }
    }

    componentDidMount() {
        firebase.database().ref("GPS_info").on("value", (snapshot) => {
            this.setState({
                region: {
                    latitude: parseFloat(snapshot.child("Latitude").val()),
                    longitude: parseFloat(snapshot.child("Longitude").val()),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                },

            })
            console.log(snapshot.child("Latitude").val())
        })
    }

    getLocation = () => {

    }

    onRegionChange = (region) => {

    }

    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <Text style={{
                    alignSelf: 'flex-start', fontSize: 20, fontWeight: 'bold', padding: 20,
                    marginLeft: 10, color: 'red', borderRadius: 20
                }}>Elderly's Location</Text>
                <MapView
                    style={{ height: 300, marginHorizontal: 20, }}
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}
                    scrollEnabled={true}
                    loadingEnabled={true}
                    camera={this.state.region}
                    minZoomLevel={17}
                    followsUserLocation={true}
                >
                    <MapView.Marker
                        coordinate={this.state.region}
                        title="Elderly fall location"
                        style={{ width: 10, height: 10 }}
                    >
                        {/* <Image source={require("../assets/fallImage.png")} style={{ width: 100, height: 100 }} /> */}
                    </MapView.Marker>
                </MapView>
            </View>
        );
    }
}