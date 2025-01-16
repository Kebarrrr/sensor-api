const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/airquality", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Mongoose Schema & Model
const sensorDataSchema = new mongoose.Schema({
  nox: { type: Number, required: true },
  nh3: { type: Number, required: true },
  co2: { type: Number, required: true },
  timestamp: { type: Number, default: Date.now },
});

const SensorData = mongoose.model("SensorData", sensorDataSchema);

// Routes

// 1. Create new sensor data
app.post("/sensor-data", async (req, res) => {
  try {
    const data = new SensorData(req.body);
    const savedData = await data.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Get all sensor data
app.get("/sensor-data", async (req, res) => {
  try {
    const data = await SensorData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get single sensor data by ID
app.get("/sensor-data/:id", async (req, res) => {
  try {
    const data = await SensorData.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update sensor data by ID
app.put("/sensor-data/:id", async (req, res) => {
  try {
    const updatedData = await SensorData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json(updatedData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Delete sensor data by ID
app.delete("/sensor-data/:id", async (req, res) => {
  try {
    const deletedData = await SensorData.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json({ message: "Data deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
