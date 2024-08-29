const tg = window.Telegram.WebApp;
tg.expand();

const API_URL = 'http://185.36.143.216:5001/api';
let cars = [];
let editingCarId = null;

async function fetchCars() {
    const response = await fetch(`${API_URL}/cars`);
    cars = await response.json();
    updateCarList();
}

async function fetchReminders() {
    const response = await fetch(`${API_URL}/reminders`);
    const reminders = await response.json();
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = reminders.map(reminder => `<li>${reminder}</li>`).join('');
}

function updateCarList() {
    const carList = document.getElementById('carList');
    carList.innerHTML = cars.map(car => `
        <li>
            ${car.brand} ${car.model} (${car.year}) - ${car.number}
            <br>Страховка до: ${car.insurance.expirationDate}
            <br>Техосмотр до: ${car.inspection.expirationDate}
            <button onclick="editCar(${car.id})">Редактировать</button>
            <button onclick="deleteCar(${car.id})">Удалить</button>
        </li>
    `).join('');
}

function sendDataToTelegram(data) {
    tg.sendData(JSON.stringify(data));
}

document.getElementById('carForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const car = {
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        year: document.getElementById('year').value,
        number: document.getElementById('number').value,
        insurance: { expirationDate: document.getElementById('insurance').value },
        inspection: { expirationDate: document.getElementById('inspection').value }
    };
    
    if (editingCarId) {
        await fetch(`${API_URL}/cars/${editingCarId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(car)
        });
        editingCarId = null;
        document.getElementById('submitBtn').textContent = 'Добавить автомобиль';
    } else {
        await fetch(`${API_URL}/cars`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(car)
        });
    }
    
    fetchCars();
    fetchReminders();
    e.target.reset();

    sendDataToTelegram({ action: editingCarId ? 'update' : 'add', car });
});

async function editCar(id) {
    const car = cars.find(c => c.id === id);
    document.getElementById('brand').value = car.brand;
    document.getElementById('model').value = car.model;
    document.getElementById('year').value = car.year;
    document.getElementById('number').value = car.number;
    document.getElementById('insurance').value = car.insurance.expirationDate;
    document.getElementById('inspection').value = car.inspection.expirationDate;
    document.getElementById('submitBtn').textContent = 'Обновить автомобиль';
    editingCarId = id;
}

async function deleteCar(id) {
    if (confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
        await fetch(`${API_URL}/cars/${id}`, { method: 'DELETE' });
        fetchCars();
        fetchReminders();
        sendDataToTelegram({ action: 'delete', carId: id });
    }
}

const closeButton = document.createElement('button');
closeButton.textContent = 'Закрыть';
closeButton.addEventListener('click', () => {
    tg.close();
});
document.body.appendChild(closeButton);

fetchCars();
fetchReminders();
