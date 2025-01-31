const admin = require('firebase-admin');

// Ganti dengan path ke file kredensial JSON Firebase kamu
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://airquality-sensor-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = admin.database();
module.exports = db;
