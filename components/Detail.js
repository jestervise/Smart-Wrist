import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, FlatList, Image } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons'
import { tempHumid } from "./SvgShapes"
import { Button, ButtonGroup, Divider } from 'react-native-elements'
var { height, width } = Dimensions.get("window")
import { LineChart, Grid, PieChart } from 'react-native-svg-charts'
import { Circle } from 'react-native-svg'
import Tooltip from './Tooltip'
import firebase from './firebaseconfig'

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
    const buttons = ["Temperature & Humidity", "Movement"]

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
    };


    contentInset = { top: 5, left: 5, right: 5, bottom: 5 }

    componentDidMount() {
        const data = [];
        firebase.database().ref("Accelerometer").once('value',
            (snapshot) => {
                snapshot.forEach((x) => {
                    data.push(x.child("Net Acceleration"))
                })
            }).then(() => { this.setState({ data: data }) })

    }


    render() {
        const data = [{
            id: 1,
            date: "2019–01–26T22:37:01Z",
            score: 3,
        },
        {
            id: 2,
            date: "2019–01–06T06:03:09Z",
            score: 9,
        },
        {
            id: 3,
            date: "2019–01–28T14:10:00Z",
            score: 10,
        },
        {
            id: 4,
            date: "2019–01–03T02:07:38Z",
            score: 7,
        },]

        const { tooltipX, tooltipY, tooltipIndex } = this.state;

        const ChartPoints = ({ x, y, color }) =>
            data.map((item, index) => (
                <Circle key={index} cx={x(item.id)} cy={y(item.score)} r={5} stroke={color} strokeWidth={2} fill='white'
                    onPress={() => this.setState({ tooltipX: item.id, tooltipY: item.score, tooltipIndex: index, })} />
            ));

        if (this.props.showChart == 0) {

            return <View stlye={{ flex: 1 }}>
                <LineChart
                    style={{ height: 200, backgroundColor: '#fff', marginLeft: 20, marginRight: 20, borderRadius: 10 }}
                    data={data}
                    xAccessor={({ item }) => item.id}
                    yAccessor={({ item }) => item.score}
                    svg={{ stroke: '#F55555', strokeWidth: 3 }}
                    contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }}
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
                </LineChart>
            </View>
        } else {
            const dataSecond = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
            const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7)
            const pieData = dataSecond
                .filter(value => value > 0)
                .map((value, index) => ({
                    value,
                    svg: {
                        fill: randomColor(),
                        onPress: () => console.log('press', index),
                    },
                    key: `pie-${index}`,
                }))


            return <View stlye={{ flex: 1 }}>
                <PieChart
                    style={{ height: 200, backgroundColor: '#fff', padding: 10, marginLeft: 20, marginRight: 20, borderRadius: 10 }}
                    data={pieData}
                    contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    numberOfTicks={0}
                    contentInset={{ top: 20, bottom: 20, left: 0, right: 0 }}
                >
                    <Grid />
                </PieChart>
            </View>
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

