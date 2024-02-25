import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TextInput, LogBox, TouchableOpacity, Text } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import tableData from '../data/winnersArray.json';

LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.']);

export default class Winners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ["Circuit", "Class", "Constructor", "Country", "Rider", "Season"],
      widthArr: [200, 90, 90, 90, 150, 80],
      searchCriteria: {},
      showSearchFields: false,
      currentPage: 0,
      rowsPerPage: 30,
    };
  }

  handleSearchChange = (header, text) => {
    this.setState((prevState) => ({
      searchCriteria: {
        ...prevState.searchCriteria,
        [header]: text.trim().toLowerCase(),
      },
    }));
  }

  toggleSearchFields = () => {
    this.setState((prevState) => ({ showSearchFields: !prevState.showSearchFields }));
  }

  rowMatchesSearch = (rowData, searchCriteria) => {
    return Object.keys(searchCriteria).every((header) => {
      const searchValue = searchCriteria[header];
      if (!searchValue) return true;
      const cellValue = rowData[this.state.tableHead.indexOf(header)].toLowerCase();
      return cellValue.includes(searchValue);
    });
  }

  handlePagination = (page) => {
    this.setState({ currentPage: page });
  }

  render() {
    const { tableHead, widthArr, searchCriteria, showSearchFields, currentPage, rowsPerPage } = this.state;

    const filteredData = tableData.filter((rowData) => this.rowMatchesSearch(rowData, searchCriteria));

    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const rowsToDisplay = filteredData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.toggleSearchFields} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>{showSearchFields ? 'Hide Search Fields' : 'Show Search Fields'}</Text>
        </TouchableOpacity>

        {showSearchFields && tableHead.map((header, index) => (
          <TextInput
            key={index}
            style={styles.searchInput}
            placeholder={`Search ${header}...`}
            onChangeText={(text) => this.handleSearchChange(header, text)}
            value={searchCriteria[header] || ''}
          />
        ))}

        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
              <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                {rowsToDisplay.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={widthArr}
                    style={{
                      ...styles.row,
                      ...(index % 2 && { backgroundColor: '#F7F6E7' })
                    }}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={() => this.handlePagination(currentPage - 1)} disabled={currentPage === 0}>
            <Text style={[styles.paginationButton, currentPage === 0 && styles.disabled]}>Previous</Text>
          </TouchableOpacity>
          <Text>{`Page ${currentPage + 1} of ${totalPages}`}</Text>
          <TouchableOpacity onPress={() => this.handlePagination(currentPage + 1)} disabled={currentPage === totalPages - 1}>
            <Text style={[styles.paginationButton, currentPage === totalPages - 1 && styles.disabled]}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' },
  searchInput: { marginBottom: 10, paddingHorizontal: 10, height: 40, borderColor: 'gray', borderWidth: 1 },
  toggleButton: { marginBottom: 10, padding: 10, backgroundColor: '#537791', alignItems: 'center' },
  toggleButtonText: { color: '#fff' },
  paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  paginationButton: { marginHorizontal: 5, color: '#537791', fontWeight: 'bold' },
  disabled: { color: '#ccc' },
});
