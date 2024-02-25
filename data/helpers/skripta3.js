// Input data
const inputData = require('../points2022.json')
const fs = require('fs');
  
  // Function to transform data
  function transformData(inputData) {
    const output = [];
    for (let raceNumber = 1; raceNumber <= 20; raceNumber++) {
      const raceData = {
        "race": `Race ${raceNumber}`,
        "values": {}
      };
      for (const [rider, raceResults] of Object.entries(inputData)) {
        raceData["values"][rider] = raceResults[`Utrka${raceNumber}`]
      }
      output.push(raceData);
    }
    return output;
  }
  
  // Transforming the data
  const outputData = transformData(inputData);
  
  const jsonData = JSON.stringify(outputData, null, 2);

  fs.writeFile('transformedData.json', jsonData, err => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Saved');
    }
  });
  ;
  