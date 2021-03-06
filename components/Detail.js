import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, FlatList, Image, ActivityIndicator } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons'
import { tempHumid } from "./SvgShapes"
import { Button, ButtonGroup, Divider } from 'react-native-elements'
var { height, width } = Dimensions.get("window")
import { LineChart, Grid, PieChart, AreaChart } from 'react-native-svg-charts'
import { Circle } from 'react-native-svg'
import Tooltip from './Tooltip'
import firebase from './firebaseconfig'
import moment from 'moment';

export class Detail extends Component {
    state = { showStatus: "Temperature", unit: "°C", selected: 1 }

    _SwitchTab = (selectedIndex) => {
        this.setState({ selected: selectedIndex })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* Back Button */}
                <View style={{ position: 'absolute', top: 30, left: 10, margin: 10, zIndex: 100, }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Feed') }} >
                        <Icon name="md-arrow-back" size={32} color="white" />
                    </TouchableOpacity>
                </View>
                {/* Main View */}
                <ScrollView style={{ flex: 1, height: "100%" }}>
                    <View style={{ flex: 1, alignItems: 'stretch', width: '100%', justifyContent: 'center', backgroundColor: '#F55555' }}>
                        <View style={{ height: 150, width: '100%' }}></View>
                        <TopStatusBar showStatus={this.state.showStatus} unit={this.state.unit} />
                        <BottomReport selected={this.state.selected} SwitchTab={this._SwitchTab} />
                    </View>
                </ScrollView>
            </View>

        );
    }
}

//Status bar shows temperature humidity
const TopStatusBar = (props) => {
    themeColor = "white"
    return (
        <View style={{ flex: 0.5, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', width: '100%', }}>
                <Text style={{ fontWeight: 'bold', fontSize: 45, color: this.themeColor }}>{tempHumid[0]}</Text>
                <Text style={{ fontSize: 13, color: this.themeColor }}>{props.showStatus}</Text>
                <Text style={{ fontSize: 13, color: this.themeColor }}>{props.unit}</Text>
                <View style={{ width: '30%', marginTop: 10, height: "4%", opacity: 0.25, borderRadius: 10, backgroundColor: this.themeColor }}></View>
                <Icon name="md-help-circle-outline" size={27} color="white" style={{ position: 'absolute', right: 20, bottom: 20, marginRight: 45, }} />
            </View>
        </View>
    )
}

//Bottom part which consist of chart and detailed movement history
const BottomReport = (props) => {
    const themeColor = "white"
    const TopTabBar = (props) => <Button title={props.title} buttonStyle={{ backgroundColor: 'transparent' }}
        containerStyle={{ margin: 2, backgroundColor: props.selected, width: '37%', height: '70%', borderWidth: 2, borderRadius: 0, borderColor: 'white' }}
        titleStyle={{ fontSize: 12.5, textAlign: 'center', textAlignVertical: 'center' }} onPress={this.buttonOnPress} />
    const buttons = ["Movement", "Temperature & Humidity"]

    buttonOnPress = () => {
        props.SwitchTab();
    }


    return <View style={{ flex: 0.6, alignItems: 'stretch', width: '100%', }}>
        <View style={{ width: '100%', height: '15%', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', }}>
            <ButtonGroup buttons={buttons} containerStyle={{
                width: '70%', height: '40%', borderRadius: 0, backgroundColor: 'transparent',
                borderWidth: 2, borderColor: themeColor, margin: 10, borderRightWidth: 2,
            }}
                textStyle={{ textAlign: 'center', color: themeColor, padding: 5, fontWeight: 'bold', fontSize: 10 }} selectedIndex={props.selected}
                selectedButtonStyle={{ backgroundColor: 'white', borderWidth: 0 }} innerBorderStyle={{ color: 'transparent', width: 0 }}
                selectedTextStyle={{ color: '#F55555' }} onPress={props.SwitchTab} />
        </View>
        <View>
            <ReportChart showChart={props.selected} />
        </View>
        <Divider style={{ margin: 0, marginTop: 20, marginBottom: 20, backgroundColor: 'white', width: '100%', height: 2 }} />
        <MovementDetails style={{ marginBottom: 20 }} />
    </View>
}

//Conditionally render different chart based on the selected tab
class ReportChart extends Component {
    state = {
        data: [],
        tooltipX: null,
        tooltipY: null,
        tooltipIndex: null,
        receivedData: false,
        receivedData2: false,
        tempData: []
    };


    contentInset = { top: 5, left: 5, right: 5, bottom: 5 }

    componentDidMount() {
        const data = [];
        const tempData = []
        var number = 0;
        var number1 = 0

        //Get temperature and humidity data
        firebase.database().ref("Environment").limitToLast(40).once('value',
            (snapshot) => {
                snapshot.forEach((x) => {
                    let humid = parseInt(x.child("Humidity").val());
                    console.log(humid)
                    let temp = parseInt(x.child("Temperature").val());
                    tempData.push({ index: number1++, humid: humid, temp: temp })
                })
            }).then(() => { this.setState({ tempData: tempData, receivedData2: true }) })

        //Get accelerometer data 
        firebase.database().ref("Accelerometer").limitToLast(40).once('value',
            (snapshot) => {
                snapshot.forEach((x) => {
                    let date = moment(x.child("Time").toJSON().toString());
                    console.log(date)
                    let numberAccel = parseFloat(x.child("Net Acceleration").toJSON().toString().split(" ")[0])
                    data.push({ index: number++, dateTime: date, accel: numberAccel })
                })
            }).then(() => { this.setState({ data: data, receivedData: true }) })



    }


    render() {


        const { tooltipX, tooltipY, tooltipIndex, data } = this.state;

        const ChartPoints = ({ x, y, color }) =>
            data.map((item, index) => (
                <Circle key={index} cx={x(item.dateTime)} cy={y(item.accel)} r={5} stroke={color} strokeWidth={2} fill='white'
                    onPress={() => this.setState({ tooltipX: item.dateTime, tooltipY: item.accel, tooltipIndex: index, })} visibility="hidden" />
            ));

        if (this.props.showChart == 0) {
            if (this.state.receivedData) {

                return <View style={{ flex: 1 }}>
                    <AreaChart
                        style={{ height: 200, backgroundColor: '#fff', marginLeft: 20, marginRight: 20, borderRadius: 10 }}
                        data={data}
                        xAccessor={({ item }) => item.dateTime}
                        yAccessor={({ item }) => item.accel}
                        svg={{ fill: '#F55555' }}
                        contentInset={{ top: 30, bottom: 20, left: 20, right: 30 }}
                        numberOfTicks={0}
                    >
                        <Grid />
                        <ChartPoints color="#F55555" />
                        <Tooltip
                            tooltipX={tooltipX}
                            tooltipY={tooltipY}
                            color="red"
                            index={tooltipIndex}
                            dataLength={data.length}
                        />
                    </AreaChart>
                </View>
            }
            else {
                return <ActivityIndicator size="small" color="#fff" />
            }
        } else {
            const { tempData } = this.state;
            const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7)
            // const pieData = dataSecond
            //     .filter(value => value > 0)
            //     .map((value, index) => ({
            //         value,
            //         svg: {
            //             fill: randomColor(),
            //             onPress: () => console.log('press', index),
            //         },
            //         key: `pie-${index}`,
            //     }))


            // return <View style={{ flex: 1 }}>
            //     {/* <PieChart
            //         style={{ height: 200, backgroundColor: '#fff', padding: 10, marginLeft: 20, marginRight: 20, borderRadius: 10 }}
            //         data={pieData}
            //         contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }}
            //         numberOfTicks={0}
            //         contentInset={{ top: 20, bottom: 20, left: 0, right: 0 }}
            //     >
            //         <Grid />
            //     </PieChart> */}


            if (this.state.receivedData2)
                return <View style={{ flex: 1 }}>
                    <LineChart
                        style={{ height: 200, backgroundColor: '#fff', marginLeft: 20, marginRight: 20, borderRadius: 10 }}
                        data={tempData}
                        xAccessor={({ item }) => item.index}
                        yAccessor={({ item }) => item.humid}
                        svg={{ stroke: '#F55555', strokeWidth: 1 }}
                        contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        numberOfTicks={0}
                    >
                        <Grid />
                        {/* <ChartPoints color="#F55555" />
        <Tooltip
            tooltipX={tooltipX}
            tooltipY={tooltipY}
            color="red"
            index={tooltipIndex}
            dataLength={data.length}
        /> */}
                    </LineChart>
                </View>
            else return <ActivityIndicator size="small" color="#fff" />

            // </View>
        }

    }
}
const listStyle = { marginLeft: 20, alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 18, color: '#fff' }

class MovementDetails extends Component {
    //Dummy data
    dataSecond = [{ date: "01/8/2019", value: 50 }, { date: "01/8/2019", value: 10 }, { date: "01/8/2019", value: 40 },
    { date: "01/8/2019", value: 95 }, { date: "01/8/2019", value: -4 }, { date: "02/8/2019", value: -24 }, { date: "02/8/2019", value: 85 },
    { date: "02/8/2019", value: 91 }, { date: "03/8/2019", value: 35 }, { date: "04/8/2019", value: 53 }, { date: "04/8/2019", value: -53 }, { date: "04/8/2019", value: 24 },
    { date: "04/8/2019", value: 50 }, { date: "05/8/2019", value: -20 }, { date: "05/8/2019", value: -80 }]
    headerItem = <Text style={listStyle}>Record</Text>
    prevIndent = 45
    indentation = 100
    currentDate = this.dataSecond[0].date

    indent = () => {
        this.indentation = this.indentation + 5
    }

    _renderItem = ({ item, index }) => {
        const listValue = <View style={{ marginLeft: this.indentation, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require("../assets/Polygon.png")} style={{ width: 18, height: 18 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Divider style={{ marginLeft: 10, backgroundColor: 'white', width: '30%', height: 1 }} />
                <Text style={[listStyle, { fontWeight: 'normal', marginLeft: 10 }]}>{item.value}</Text>
                <Divider style={{ marginLeft: 10, backgroundColor: 'white', width: '30%', height: 1 }} />
            </View>

        </View>
        const listItem = <View>
            <View style={{ marginLeft: this.prevIndent, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={listStyle}>{item.date}</Text>
            </View>
            {listValue}
        </View>

        if (item.date != this.currentDate) {
            this.currentDate = item.date;
            return listItem
        }
        return listValue
    }

    render() {
        return <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', }}>
            <View style={{ flex: 1 }}>
                <FlatList data={this.dataSecond}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this.headerItem}
                    style={{ flex: 1, marginBottom: "40%" }}
                />
            </View>

        </View>

    }

}

