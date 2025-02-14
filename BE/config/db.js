const admin = require("firebase-admin");
// const serviceAccount = require("./fb-credentials.json");
const serviceAccount = require("./moviepass-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
});

const db = admin.firestore();
module.exports = db;
