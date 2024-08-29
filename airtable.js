const Airtable = require('airtable');

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

async function getCars() {
  const records = await base('Cars').select().all();
  return records.map(record => ({
    id: record.id,
    brand: record.get('Brand'),
    model: record.get('Model'),
    year: record.get('Year'),
    number: record.get('Number'),
    insurance: record.get('Insurance'),
    inspection: record.get('Inspection')
  }));
}

async function addCar(car) {
  const record = await base('Cars').create(car);
  return record.id;
}

async function updateCar(id, car) {
  await base('Cars').update(id, car);
}

async function deleteCar(id) {
  await base('Cars').destroy(id);
}

module.exports = {
  getCars,
  addCar,
  updateCar,
  deleteCar
};
