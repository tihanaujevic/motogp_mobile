import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, LogBox } from 'react-native';
import { BarChart, Grid, XAxis, YAxis, LineChart } from 'react-native-svg-charts';
import { scaleBand } from 'd3-scale';
import tableData from '../data/winnersArray.json';
import { Text as SvgText } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';
import pickerData from '../data/winners.json';

LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop `data` supplied to `YAxis`, expected one of type [object, number].',
'Warning: Failed prop type: Invalid prop `data[0]` supplied to `XAxis`, expected one of type [number, object].'
]);

const pickerClass = [...new Set(pickerData.map(item => item.Class))];
const pickerCircuit = [...new Set(pickerData.map(item => item.Circuit))];
const pickerRider = [...new Set(pickerData.map(item => item.Rider))];

export default class Statictics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topSixConstructors: [],
            topTenDrivers: [],
            topFiveDriversOnCircuit: [],
            isGraphVisible: false,
            isDriverGraphVisible: false,
            isDriverOnCircuitGraphVisible: false,
            isDriverPerSeasonGraphVisible: false,
            selectedFilter: 'All',
            uniqueClasses: pickerClass,
            selectedCircuit: pickerCircuit[0],
            uniqueCircuits: pickerCircuit,
            selectedDriverOrConstr: "Riders",
            selectedRider: '',
            victoriesPerSeason: {},
            searchText: '',
        };
    }

    componentDidMount() {
        this.calculateTopSixConstructors(this.state.selectedFilter);
        this.calculateTopTenDrivers(this.state.selectedFilter);
        this.calculateTopFiveDriversOnCircuit(this.state.selectedFilter, this.state.selectedCircuit, this.selectedDriverOrConstr);
        this.calculateVictoriesPerSeason(this.state.selectedFilter, this.state.selectedRider);
    }

    calculateTopSixConstructors = (filter) => {
        const filteredData = filter === 'All' ? tableData : tableData.filter(dataRow => dataRow[1] === filter);
        const constructorCounts = {};
        filteredData.forEach((rowData) => {
            const constructor = rowData[2];
            constructorCounts[constructor] = (constructorCounts[constructor] || 0) + 1;
        });
        const constructorCountsArray = Object.entries(constructorCounts).map(([constructor, count]) => ({ constructor, count }));
        constructorCountsArray.sort((a, b) => b.count - a.count);
        const topSixConstructors = constructorCountsArray.slice(0, 6);
        this.setState({ topSixConstructors });
    }

    calculateTopTenDrivers = (filter) => {
        const filteredData = filter === 'All' ? tableData : tableData.filter(dataRow => dataRow[1] === filter);
        const driverCounts = {};
        filteredData.forEach((rowData) => {
            const driver = rowData[4];
            driverCounts[driver] = (driverCounts[driver] || 0) + 1;
        });
        const driverCountsArray = Object.entries(driverCounts).map(([driver, count]) => ({ driver, count }));
        driverCountsArray.sort((a, b) => b.count - a.count);
        const topTenDrivers = driverCountsArray.slice(0, 10);
        this.setState({ topTenDrivers });
    }

    calculateTopFiveDriversOnCircuit = (filter, filterCircuit, what) => {
        let filteredData = filter === 'All' ? tableData : tableData.filter(dataRow => dataRow[1] === filter);
        filteredData = filterCircuit ? filteredData.filter(dataRow => dataRow[0] === filterCircuit) : filteredData.filter(dataRow => dataRow[0] === pickerCircuit[0]);
        const driverCounts = {};
        what = what === 'Constructors' ? 2 : 4;
        filteredData.forEach((rowData) => {
            const driver = rowData[what];
            driverCounts[driver] = (driverCounts[driver] || 0) + 1;
        });
        const driverCountsArray = Object.entries(driverCounts).map(([driver, count]) => ({ driver, count }));
        driverCountsArray.sort((a, b) => b.count - a.count);
        const topFiveDriversOnCircuit = driverCountsArray.slice(0, 5);
        this.setState({ topFiveDriversOnCircuit });
    }

    calculateVictoriesPerSeason = (filter, filterRider) => {
        let filteredData = filter === 'All' ? tableData : tableData.filter(dataRow => dataRow[1] === filter);
        
        if (pickerRider.includes(filterRider))
            filteredData = filteredData.filter(dataRow => dataRow[4] === filterRider);

        else if(pickerRider.filter(r => r.toLowerCase().includes(this.state.searchText.toLowerCase()))[0]){
            filterRider = pickerRider.filter(r => r.toLowerCase().includes(this.state.searchText.toLowerCase()))[0];
            filteredData = filteredData.filter(dataRow => dataRow[4] === filterRider);
        }
            
        else filteredData = filteredData.filter(dataRow => dataRow[4] === pickerRider[0]);

        const victoriesPerSeason = {};
        for (let i = 0; i < filteredData.length; i++) {
            const season = filteredData[i][5];

            if (victoriesPerSeason[season]) {
                victoriesPerSeason[season]++;
            } else {
                victoriesPerSeason[season] = 1;
            }
        }
        this.setState({ selectedRider: filterRider});
        this.setState({ victoriesPerSeason });
    }

    toggleGraphVisibility = () => {
        this.setState(prevState => ({ isGraphVisible: !prevState.isGraphVisible }));
    }

    toggleDriverGraphVisibility = () => {
        this.setState(prevState => ({ isDriverGraphVisible: !prevState.isDriverGraphVisible }));
    }

    toggleDriverOnCircuitGraphVisibility = () => {
        this.setState(prevState => ({ isDriverOnCircuitGraphVisible: !prevState.isDriverOnCircuitGraphVisible }));
    }

    toggleDriverPerSeasonGraphVisibility = () => {
        this.setState(prevState => ({ isDriverPerSeasonGraphVisible: !prevState.isDriverPerSeasonGraphVisible }));
    }

    handleFilterChange = (itemValue) => {
        this.setState({ selectedFilter: itemValue });
        this.calculateTopSixConstructors(itemValue);
        this.calculateTopTenDrivers(itemValue);
        this.calculateTopFiveDriversOnCircuit(itemValue, this.state.selectedCircuit);
        this.calculateVictoriesPerSeason(itemValue, this.state.searchText);
    }

    handleCircuitChange = (itemValue) => {
        this.setState({ selectedCircuit: itemValue });
        this.calculateTopFiveDriversOnCircuit(this.state.selectedFilter, itemValue);
    }

    handleRiderChange = (itemValue) => {
        this.setState({ selectedRider: itemValue });
        this.calculateVictoriesPerSeason(this.state.selectedFilter, itemValue);
    }

    handleRidersOrConstrChange = (itemValue) => {
        this.setState({ selectedDriverOrConstr: itemValue });
        this.calculateTopFiveDriversOnCircuit(this.state.selectedFilter, this.state.selectedCircuit, itemValue);
    }

    handleSearch = (itemValue) => {
        this.setState({ searchText: itemValue }, () => {
            this.calculateVictoriesPerSeason(this.state.selectedFilter, itemValue);
        });
    }


    render() {
        const { topSixConstructors, topTenDrivers, isGraphVisible, isDriverGraphVisible, selectedFilter, uniqueClasses, selectedCircuit, uniqueCircuits, isDriverOnCircuitGraphVisible, topFiveDriversOnCircuit, isDriverPerSeasonGraphVisible, selectedRider, victoriesPerSeason } = this.state;

        const constructorData = topSixConstructors.map(item => ({
            label: item.constructor,
            value: item.count,
        }));

        const constructorLabels = constructorData.map(item => item.label);
        const constructorValues = constructorData.map(item => item.value);

        const driverData = topTenDrivers.map(item => ({
            label: item.driver,
            value: item.count,
        }));

        const driverLabels = driverData.map(item => item.label);
        const driverValues = driverData.map(item => item.value);

        const driverOnCircuitData = topFiveDriversOnCircuit.map(item => ({
            label: item.driver,
            value: item.count,
        }));

        const driverOnCircuitLabels = driverOnCircuitData.map(item => item.label);
        const driverOnCircuitValues = driverOnCircuitData.map(item => item.value);

        const victoriesPerSeasonData = Object.keys(victoriesPerSeason);
        const victoriesPerSeasonValues = Object.values(victoriesPerSeason);

        const CUT_OFF = Math.max(...driverValues) / 1.5;
        const Labels = ({ x, y, bandwidth, data }) => (
            driverValues.map((value, index) => (
                <SvgText
                    key={index}
                    x={value > CUT_OFF ? x(value) - 30 : x(value) + 10}
                    y={y(index) + (bandwidth / 2)}
                    fontSize={14}
                    fill={value > CUT_OFF ? 'white' : 'black'}
                    alignmentBaseline='middle'
                >
                    {value}
                </SvgText>
            ))
        )

        const CUT_OFF_circuit = Math.max(...driverOnCircuitValues) / 1.2;
        const LabelsDriversOnCircuit = ({ x, y, bandwidth, data }) => (
            driverOnCircuitValues.map((value, index) => (
                <SvgText
                    key={index}
                    x={value > CUT_OFF_circuit ? x(value) - 30 : x(value) + 10}
                    y={y(index) + (bandwidth / 2)}
                    fontSize={14}
                    fill={value > CUT_OFF_circuit ? 'white' : 'black'}
                    alignmentBaseline='middle'
                >
                    {value}
                </SvgText>
            ))
        )


        return (
            <ScrollView>
                <View style={styles.container}>
                    <Picker
                        selectedValue={selectedFilter}
                        style={{ height: 50, width: 150 }}
                        onValueChange={this.handleFilterChange}
                    >
                        <Picker.Item label="All" value="All" />
                        {uniqueClasses.map((item, index) => (
                            <Picker.Item key={index} label={item} value={item} />
                        ))}
                    </Picker>
                    <TouchableOpacity onPress={this.toggleGraphVisibility} style={styles.button}>
                        <Text style={styles.buttonText}>{isGraphVisible ? 'Hide Constructor Graph' : 'Show Constructor Graph'}</Text>
                    </TouchableOpacity>
                    {isGraphVisible && (
                        <View>
                            <Text style={styles.title}>Top Six Constructors with Most Victories</Text>
                            <View style={{ height: 300, flexDirection: 'row' }}>
                                <YAxis
                                    data={constructorValues}
                                    style={{ marginBottom: 10 }}
                                    contentInset={{ top: 10, bottom: 28 }}
                                    svg={{ fontSize: 10, fill: 'grey' }}
                                    numberOfTicks={10}
                                    formatLabel={value => `${value}`}
                                />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <BarChart
                                        style={{ flex: 1 }}
                                        data={constructorData}
                                        yAccessor={({ item }) => item.value}
                                        xAccessor={({ item }) => item.label}
                                        svg={{ fill: 'rgb(134, 65, 244)' }}
                                        contentInset={{ top: 10, bottom: 10 }}
                                    >
                                        <Grid />
                                    </BarChart>
                                    <XAxis
                                        style={{ marginTop: 10 }}
                                        data={constructorData}
                                        scale={scaleBand}
                                        formatLabel={(value, index) => constructorLabels[index]}
                                        svg={{ fontSize: 10, fill: 'grey' }}
                                        contentInset={{ left: 0, right: 0, top: 0, bottom: 10 }}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                    <TouchableOpacity onPress={this.toggleDriverGraphVisibility} style={styles.button}>
                        <Text style={styles.buttonText}>{isDriverGraphVisible ? 'Hide Driver Graph' : 'Show Driver Graph'}</Text>
                    </TouchableOpacity>
                    {isDriverGraphVisible && (
                        <View>
                            <Text style={styles.title}>Top Ten Riders with Most Victories</Text>
                            <View style={{ height: 300, flexDirection: 'row' }}>
                                <YAxis
                                    style={{ marginBottom: 10 }}
                                    data={driverLabels}
                                    scale={scaleBand}
                                    formatLabel={(value, index) => driverLabels[index]}
                                    contentInset={{ top: 10, bottom: 28 }}
                                    svg={{ fontSize: 10, fill: 'grey' }}
                                />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <BarChart
                                        style={{ flex: 1 }}
                                        data={driverData}
                                        yAccessor={({ item }) => item.value}
                                        xAccessor={({ item }) => item.label}
                                        svg={{ fill: 'rgb(134, 65, 244)' }}
                                        contentInset={{ top: 10, bottom: 10 }}
                                        horizontal={true}
                                        gridMin={0}
                                        spacingInner={0.1}
                                    >
                                        <Labels />
                                    </BarChart>
                                    <XAxis
                                        style={{ marginTop: 10 }}
                                        data={driverData}
                                        scale={scaleBand}
                                        contentInset={{ left: 20, right: 20, bottom: 0 }}
                                        spacingInner={0.1}
                                        spacingOuter={0.1}
                                        formatLabel={() => ''}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                    <TouchableOpacity onPress={this.toggleDriverOnCircuitGraphVisibility} style={styles.button}>
                        <Text style={styles.buttonText}>{isDriverOnCircuitGraphVisible ? 'Hide Victories at Circuit Graph' : 'Show Victories at Circuit Graph'}</Text>
                    </TouchableOpacity>
                    {isDriverOnCircuitGraphVisible && (
                        <View>
                            <Picker
                                selectedValue={selectedCircuit}
                                style={{ height: 50, width: 250 }}
                                onValueChange={this.handleCircuitChange}
                            >
                                {uniqueCircuits.map((item, index) => (
                                    <Picker.Item key={index} label={item} value={item} />
                                ))}
                            </Picker>
                            <Picker
                                selectedValue={this.state.selectedDriverOrConstr}
                                style={{ height: 50, width: 250 }}
                                onValueChange={this.handleRidersOrConstrChange}
                            >
                                <Picker.Item label="Riders" value="Riders" />
                                <Picker.Item label="Constructors" value="Constructors" />
                            </Picker>
                            <Text style={styles.title}>Top Five {this.state.selectedDriverOrConstr} with Most Victories at {selectedCircuit}</Text>
                            <View style={{ height: 300, flexDirection: 'row' }}>
                                <YAxis
                                    style={{ marginBottom: 10 }}
                                    data={driverOnCircuitLabels}
                                    scale={scaleBand}
                                    formatLabel={(value, index) => driverOnCircuitLabels[index]}
                                    contentInset={{ top: 10, bottom: 28 }}
                                    svg={{ fontSize: 10, fill: 'grey' }}
                                />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <BarChart
                                        style={{ flex: 1 }}
                                        data={driverOnCircuitData}
                                        yAccessor={({ item }) => item.value}
                                        xAccessor={({ item }) => item.label}
                                        svg={{ fill: 'rgb(134, 65, 244)' }}
                                        contentInset={{ top: 10, bottom: 10 }}
                                        horizontal={true}
                                        gridMin={0}
                                        spacingInner={0.1}
                                    >
                                        <LabelsDriversOnCircuit />
                                    </BarChart>
                                    <XAxis
                                        style={{ marginTop: 10 }}
                                        data={driverOnCircuitData}
                                        scale={scaleBand}
                                        contentInset={{ left: 20, right: 20, bottom: 0 }}
                                        spacingInner={0.1}
                                        spacingOuter={0.1}
                                        formatLabel={() => ''}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                    <TouchableOpacity onPress={this.toggleDriverPerSeasonGraphVisibility} style={styles.button}>
                        <Text style={styles.buttonText}>{isDriverPerSeasonGraphVisible ? 'Hide Victories per Season Graph' : 'Show Victories per Season Graph'}</Text>
                    </TouchableOpacity>
                    {isDriverPerSeasonGraphVisible && (
                        <View>
                            <View style={styles.searchContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search Riders"
                                        onChangeText={this.handleSearch}
                                        value={this.state.searchText}
                                    />
                                    <Picker
                                        selectedValue={selectedRider}
                                        style={{ height: 50, width: 250 }}
                                        onValueChange={this.handleRiderChange}
                                    >
                                        {pickerRider
                                            .filter(item => item.toLowerCase().includes(this.state.searchText.toLowerCase()))
                                            .map((item, index) => (
                                                <Picker.Item key={index} label={item} value={item} />
                                            ))}
                                    </Picker>
                                </View>
                            </View>
                            <View style={{ height: 200, width: 400, padding: 20, flexDirection: 'row' }}>
                                <YAxis
                                    data={victoriesPerSeasonValues}
                                    style={{ marginBottom: 30 }}
                                    contentInset={{ top: 10, bottom: 10 }}
                                    svg={{ fontSize: 10, fill: 'grey' }}
                                />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <LineChart
                                        style={{ flex: 1 }}
                                        data={victoriesPerSeasonValues}
                                        contentInset={{ top: 10, bottom: 10 }}
                                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                                    >
                                        <Grid />
                                    </LineChart>
                                    <XAxis
                                        style={{ marginHorizontal: -10, height: 30 }}
                                        data={victoriesPerSeasonData}
                                        formatLabel={(value, index) => victoriesPerSeasonData[index]}
                                        contentInset={{ left: 10, right: 20 }}
                                        svg={{ fontSize: 10, fill: 'grey', rotation: -30, translateY: 5 }}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'transparent',
        padding: 10,
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'blue',
        textAlign: 'center',
    },
    searchContainer: {
        marginVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});
