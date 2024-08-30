require('dotenv').config();
console.log('Environment variables loaded:', 
  process.env.AIRTABLE_ACCESS_TOKEN ? 'Access Token set' : 'Access Token not set', 
  process.env.AIRTABLE_BASE_ID ? 'Base ID set' : 'Base ID not set'
);

const express = require('express');
const app = express();
const path = require('path');
const airtable = require('./airtable');

// Miiiiiiiiiddleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Маршрут для корневой страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обновите API endpoints
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await airtable.getCars();
    res.json(cars);
  } catch (error) {
    console.error('Ошибка при получении списка автомобилей:', error);
    res.status(500).json({ error: 'Не удалось получить список автомобилей' });
  }
});

app.post('/api/cars', async (req, res) => {
  try {
    const id = await airtable.addCar(req.body);
    res.json({ id });
  } catch (error) {
    console.error('Ошибка при добавлении автомобиля:', error);
    res.status(500).json({ error: 'Не удалось добавиь автомобиль' });
  }
});

app.put('/api/cars/:id', async (req, res) => {
  try {
    await airtable.updateCar(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении автомобиля:', error);
    res.status(500).json({ error: 'Не удалось обновить автомобиль' });
  }
});

app.delete('/api/cars/:id', async (req, res) => {
  try {
    await airtable.deleteCar(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении автомобиля:', error);
    res.status(500).json({ error: 'Не удлось удалить автомобиль' });
  }
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так!');
});

// Запуск сервера
const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => console.log('Сервер запущен на порту ' + PORT));
