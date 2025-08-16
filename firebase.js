const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");

const serviceAccount = require("./vinch-adb9a-firebase-adminsdk-fbsvc-169b9f7d9d.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = {
  db,
};
