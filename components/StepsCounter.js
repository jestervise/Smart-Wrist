import Expo from "expo";
import React from "react";
import { Pedometer } from "expo";
import { StyleSheet, View } from "react-native";
import {Text} from 'react-native-elements'

export default class PedometerSensor extends React.Component {
  state = {
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0
  };

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps
      });
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result)
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: "Could not get isPedometerAvailable: " + error
        });
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: "Could not get stepCount: " + error
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    let h3Style= {color:"red"}
    return (
      <View style={styles.container}>
        <Text>
          Is pedometer available in this device? 
        </Text>
        <Text h3 h3Style={h3Style}>{this.state.isPedometerAvailable?"Yes":"No"}</Text>
        <Text>
          Steps taken in the last 24 hours:
        </Text>
        <Text h3 h3Style={h3Style}>{this.state.pastStepCount}</Text>
        <Text>Walk! And watch this goes up </Text>
        <Text h3 h3Style={h3Style}>{this.state.currentStepCount}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  }
});