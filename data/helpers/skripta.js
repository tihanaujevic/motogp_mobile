const originalData = require('../riderInfo.json');

const fs = require('fs');

const transformedData = originalData.map(obj => {
  return {
    name: obj["Riders All Time in All Classes"],
    data: [
      { value: obj["Victories"], label: "Victories" },
      { value: obj["2nd places"], label: "2nd places" },
      { value: obj["3rd places"], label: "3rd places" },
      { value: obj["Pole positions from '74 to 2022"], label: "Pole positions" },
      { value: obj["Race fastest lap to 2022"], label: "Race fastest laps" },
      { value: obj["World Championships"], label: "World Championships" }
    ]
  };
});

const jsonData = JSON.stringify(transformedData, null, 2);

fs.writeFile('transformedData.json', jsonData, err => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('Saved');
  }
});
;