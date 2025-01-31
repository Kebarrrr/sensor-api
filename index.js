const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let sensorData = [];

app.get('/', (req, res) => {
    res.send('Welcome to the Sensor Data API!');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/sensor-data', (req, res) => {
    res.json(sensorData);
});

app.post('/sensor-data', (req, res) => {
    const { nox, nh3, co2 } = req.body; 
    if (!nox || !nh3 || !co2) { 
        return res.status(400).json({ error: 'All fields (nox, nh3, co2) are required!' });
    }

    const newEntry = {
        id: uuidv4(),
        nox,
        nh3,
        co2,
        timestamp: Date.now(),
    };

    sensorData.push(newEntry);
    res.status(201).json(newEntry);
});
app.get('/sensor-data/:id', (req, res) => {
    const id = req.params.id; // Keep id as a string
    const entry = sensorData.find(data => data.id === id);

    if (!entry) {
        return res.status(404).json({ error: 'Data not found!' });
    }

    res.json(entry);
});

app.delete('/sensor-data/:id', (req, res) => {
    const id = req.params.id;
    const index = sensorData.findIndex(data => data.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Data not found!' });
    }

    sensorData.splice(index, 1);
    res.json({ message: 'Data deleted successfully!' });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});