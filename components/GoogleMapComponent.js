import { MapView } from 'expo'
import React, { Component } from 'react'
import { View } from 'react-native'
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
                title: 'hello',
                coordinates: {
                    latitude: 37.78825,
                    longitude: -122.4324,
                },
            },]
        }
    }

    getLocation=()=>{
        
    }

    onRegionChange = (region) => {

    }

    render() {
        return (
            <View>
                <MapView
                    style={{ height: 300, marginHorizontal: 20, }}
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}
                >
                    <MapView.Marker
                        coordinate={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                        }}
                        title="Elderly fall location"
                    />
                </MapView>
            </View>
        );
    }
}