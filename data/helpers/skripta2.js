// Function to generate random integer between min and max (inclusive)
const fs = require('fs');
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  // Mock data generation
  const mockData = [];
  const riders = [
    'Bagnaia',
    'Marquez',
    'Rossi',
    'Dovizioso',
    'Quartararo',
    'Miller',
    'Mir',
    'Rins',
    'Zarco',
    'Oliveira',
    'Espargaro',
    'Binder',
    'Espargaroo', // Assuming this is a different Espargaro than the previous one
    'Nakagami',
    'Petrucci',
    'Vinales',
    'Bradl',
    'Lecuona',
    'A. Marquez',
    'Rabat'
  ];
  
  const numRaces = 20;
  const numRiders = 20;
  
  for (let i = 1; i <= numRaces; i++) {
    const raceData = { race: `Race ${i}`, values: {} };
    for (let j = 0; j < numRiders; j++) {
      const riderName = riders[j % riders.length];
      const value = getRandomInt(5, 50); // Adjust range as needed
      raceData.values[riderName] = value;
    }
    mockData.push(raceData);
  }
  
  const jsonData = JSON.stringify(mockData, null, 2);

  fs.writeFile('mockedData.json', jsonData, err => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Saved');
    }
  });
  ;
  