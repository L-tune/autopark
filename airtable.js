const Airtable = require('airtable');

console.log('AIRTABLE_ACCESS_TOKEN:', process.env.AIRTABLE_ACCESS_TOKEN ? 'Установлен' : 'Не установлен');
console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID);

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

const TABLE_NAME = 'Table 1'; // Было 'Cars'

async function getCars() {
  try {
    console.log('Attempting to fetch cars...');
    const records = await base(TABLE_NAME).select().all();
    console.log('Records fetched:', records.length);
    return records.map(record => ({
      id: record.id,
      brand: record.fields.Brand,
      year: record.fields.Year,
      lastInspection: record.fields.LastInspection,
      nextInspection: record.fields.NextInspection
    }));
  } catch (error) {
    console.error('Error in getCars:', error);
    throw error;
  }
}

async function addCar(car) {
  try {
    console.log('Attempting to add car:', car);
    const createdRecords = await base(TABLE_NAME).create([
      {
        fields: {
          Brand: car.brand,
          Year: parseInt(car.year),
          LastInspection: car.lastInspection,
          NextInspection: car.nextInspection
        }
      }
    ]);
    console.log('Car added:', createdRecords[0].id);
    return createdRecords[0].id;
  } catch (error) {
    console.error('Error in addCar:', error);
    throw error;
  }
}

async function updateCar(id, car) {
  try {
    console.log('Attempting to update car:', id, car);
    await base(TABLE_NAME).update([
      {
        id: id,
        fields: {
          Brand: car.brand,
          Year: parseInt(car.year),
          LastInspection: car.lastInspection,
          NextInspection: car.nextInspection
        }
      }
    ]);
    console.log('Car updated:', id);
  } catch (error) {
    console.error('Error in updateCar:', error);
    throw error;
  }
}

async function deleteCar(id) {
  try {
    console.log('Attempting to delete car:', id);
    await base(TABLE_NAME).destroy([id]);
    console.log('Car deleted:', id);
  } catch (error) {
    console.error('Error in deleteCar:', error);
    throw error;
  }
}

module.exports = {
  getCars,
  addCar,
  updateCar,
  deleteCar
};
